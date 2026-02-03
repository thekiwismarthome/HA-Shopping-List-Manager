"""Core Shopping List Manager with invariant enforcement."""
import asyncio
import logging
from typing import Dict, Optional, List

from homeassistant.core import HomeAssistant
from homeassistant.helpers import storage

from .const import (
    DOMAIN,
    EVENT_SHOPPING_LIST_UPDATED,
    STORAGE_KEY_ACTIVE,
    STORAGE_KEY_PRODUCTS,
    STORAGE_VERSION,
)
from .models import Product, ActiveItem, InvariantError, validate_invariant

_LOGGER = logging.getLogger(__name__)


class ShoppingListManager:
    """
    Manages shopping list with enforced invariants.
    
    Architecture principles:
    1. Products and active_list are separate concerns
    2. Products are authoritative, persistent data
    3. Active list is ephemeral state
    4. Invariant is enforced on every mutation
    5. Lock ensures atomic operations
    """
    
    def __init__(self, hass: HomeAssistant):
        """Initialize the manager."""
        self.hass = hass
        self._products: Dict[str, Product] = {}
        self._active_list: Dict[str, ActiveItem] = {}
        self._lock = asyncio.Lock()
        
        # Storage instances
        self._store_products = storage.Store(
            hass, STORAGE_VERSION, STORAGE_KEY_PRODUCTS
        )
        self._store_active = storage.Store(
            hass, STORAGE_VERSION, STORAGE_KEY_ACTIVE
        )
    
    async def async_load(self) -> None:
        """
        Load data from storage and validate invariant.
        
        If invariant is violated on load, we repair by removing
        orphaned active_list entries rather than failing.
        """
        async with self._lock:
            # Load products first (authoritative)
            products_data = await self._store_products.async_load()
            if products_data:
                self._products = {
                    key: Product.from_dict(data)
                    for key, data in products_data.items()
                }
            
            # Load active list
            active_data = await self._store_active.async_load()
            if active_data:
                self._active_list = {
                    key: ActiveItem.from_dict(data)
                    for key, data in active_data.items()
                }
            
            # Repair invariant violations from storage
            await self._async_repair_invariant()
            
            _LOGGER.info(
                "Loaded %d products and %d active items",
                len(self._products),
                len(self._active_list)
            )
    
    async def _async_repair_invariant(self) -> None:
        """
        Repair invariant violations by removing orphaned active items.
        
        This is defensive - should only happen if storage was manually edited
        or data corruption occurred.
        """
        orphaned_keys = []
        for key in self._active_list:
            if key not in self._products:
                orphaned_keys.append(key)
        
        if orphaned_keys:
            _LOGGER.warning(
                "Found %d orphaned active items, removing: %s",
                len(orphaned_keys),
                orphaned_keys
            )
            for key in orphaned_keys:
                del self._active_list[key]
            
            # Persist the repair
            await self._async_save_active()
    
    async def _async_save_products(self) -> None:
        """Persist products to storage."""
        data = {key: product.to_dict() for key, product in self._products.items()}
        await self._store_products.async_save(data)
    
    async def _async_save_active(self) -> None:
        """Persist active list to storage."""
        data = {key: item.to_dict() for key, item in self._active_list.items()}
        await self._store_active.async_save(data)
    
    def _fire_update_event(self) -> None:
        """Fire event to notify listeners of changes."""
        self.hass.bus.async_fire(EVENT_SHOPPING_LIST_UPDATED)
    
    # ========================================================================
    # PUBLIC API - All operations enforce invariants
    # ========================================================================
    
    async def async_add_product(
        self,
        key: str,
        name: str,
        category: str = "other",
        unit: str = "pcs",
        image: str = ""
    ) -> Product:
        """
        Add or update a product in the catalog.
        
        This operation:
        - Creates/updates product metadata
        - Does NOT modify quantities
        - Is idempotent
        - Persists to storage
        
        Args:
            key: Unique product identifier
            name: Display name
            category: Product category
            unit: Unit of measurement
            image: Image URL
            
        Returns:
            The created/updated Product
        """
        async with self._lock:
            product = Product(
                key=key,
                name=name,
                category=category,
                unit=unit,
                image=image
            )
            
            self._products[key] = product
            await self._async_save_products()
            
            _LOGGER.debug("Added/updated product: %s (%s)", name, key)
            self._fire_update_event()
            
            return product
    
    async def async_set_qty(self, key: str, qty: int) -> None:
        """
        Set quantity for a product on the shopping list.
        
        This operation:
        - REQUIRES product to exist (enforces invariant)
        - qty > 0: adds/updates active_list
        - qty == 0: removes from active_list
        - Persists state
        - Fires update event
        
        Args:
            key: Product key (must exist in catalog)
            qty: New quantity (0 to remove, >0 to add/update)
            
        Raises:
            InvariantError: If product doesn't exist
            ValueError: If qty is negative
        """
        if qty < 0:
            raise ValueError(f"Quantity cannot be negative: {qty}")
        
        async with self._lock:
            # INVARIANT ENFORCEMENT: Product must exist
            if key not in self._products:
                raise InvariantError(
                    f"Cannot set quantity for unknown product '{key}'. "
                    f"Product must be created first with add_product."
                )
            
            # Update or remove from active list
            if qty > 0:
                self._active_list[key] = ActiveItem(qty=qty)
                _LOGGER.debug("Set qty for %s: %d", key, qty)
            else:
                # qty == 0: remove from list
                if key in self._active_list:
                    del self._active_list[key]
                    _LOGGER.debug("Removed %s from active list", key)
            
            await self._async_save_active()
            self._fire_update_event()
    
    async def async_delete_product(self, key: str) -> None:
        """
        Delete a product from the catalog.
        
        This operation:
        - Removes product from catalog
        - Removes from active list (maintains invariant)
        - Persists both changes
        
        Args:
            key: Product key to delete
        """
        async with self._lock:
            if key not in self._products:
                _LOGGER.warning("Attempted to delete non-existent product: %s", key)
                return
            
            # Remove from catalog
            del self._products[key]
            
            # Remove from active list (maintain invariant)
            if key in self._active_list:
                del self._active_list[key]
            
            await self._async_save_products()
            await self._async_save_active()
            
            _LOGGER.debug("Deleted product: %s", key)
            self._fire_update_event()
    
    async def async_get_products(self) -> Dict[str, dict]:
        """
        Get all products in the catalog.
        
        Returns:
            Dictionary of product key -> product data
        """
        async with self._lock:
            return {key: product.to_dict() for key, product in self._products.items()}
    
    async def async_get_active(self) -> Dict[str, dict]:
        """
        Get active shopping list.
        
        Returns:
            Dictionary of product key -> active item data (qty only)
        """
        async with self._lock:
            return {key: item.to_dict() for key, item in self._active_list.items()}
    
    async def async_get_full_state(self) -> dict:
        """
        Get complete state for frontend.
        
        Returns combined view with product metadata + quantities.
        This is a convenience method for UI rendering.
        
        Returns:
            {
                "products": {...},
                "active_list": {...}
            }
        """
        async with self._lock:
            # Validate invariant before returning state
            validate_invariant(self._products, self._active_list)
            
            return {
                "products": {key: p.to_dict() for key, p in self._products.items()},
                "active_list": {key: a.to_dict() for key, a in self._active_list.items()}
            }
    
    def get_product(self, key: str) -> Optional[Product]:
        """
        Get a single product (synchronous, lock-free read).
        
        Args:
            key: Product key
            
        Returns:
            Product if exists, None otherwise
        """
        return self._products.get(key)
    
    def get_active_qty(self, key: str) -> int:
        """
        Get quantity for a product (synchronous, lock-free read).
        
        Args:
            key: Product key
            
        Returns:
            Quantity if on active list, 0 otherwise
        """
        item = self._active_list.get(key)
        return item.qty if item else 0
