"""
Shopping List Manager - Home Assistant Custom Integration
Clean-slate architecture with enforced invariants
"""
import logging
from homeassistant.config_entries import ConfigEntry
from homeassistant.core import HomeAssistant
from homeassistant.components import websocket_api

from .const import DOMAIN
from .manager import ShoppingListManager

_LOGGER = logging.getLogger(__name__)


async def async_setup_entry(hass: HomeAssistant, entry: ConfigEntry) -> bool:
    """Set up Shopping List Manager from a config entry."""
    # Initialize the manager
    manager = ShoppingListManager(hass)
    await manager.async_load()
    
    # Store manager in hass.data
    hass.data.setdefault(DOMAIN, {})
    hass.data[DOMAIN]["manager"] = manager
    
    # Register WebSocket commands manually
    register_websocket_commands(hass)
    
    _LOGGER.info("Shopping List Manager setup complete")
    
    return True


async def async_unload_entry(hass: HomeAssistant, entry: ConfigEntry) -> bool:
    """Unload Shopping List Manager."""
    hass.data[DOMAIN].pop("manager", None)
    return True


def register_websocket_commands(hass: HomeAssistant) -> None:
    """Register all WebSocket commands."""
    import voluptuous as vol
    from .models import InvariantError
    
    @websocket_api.websocket_command({
        vol.Required("type"): "shopping_list_manager/add_product",
        vol.Required("key"): str,
        vol.Required("name"): str,
        vol.Optional("category", default="other"): str,
        vol.Optional("unit", default="pcs"): str,
        vol.Optional("image", default=""): str,
    })
    @websocket_api.async_response
    async def handle_add_product(hass, connection, msg):
        """Add or update a product."""
        manager = hass.data[DOMAIN]["manager"]
        try:
            product = await manager.async_add_product(
                key=msg["key"],
                name=msg["name"],
                category=msg.get("category", "other"),
                unit=msg.get("unit", "pcs"),
                image=msg.get("image", "")
            )
            connection.send_result(msg["id"], product.to_dict())
        except Exception as err:
            _LOGGER.error("Error adding product: %s", err)
            connection.send_error(msg["id"], "add_product_failed", str(err))
    
    @websocket_api.websocket_command({
        vol.Required("type"): "shopping_list_manager/set_qty",
        vol.Required("key"): str,
        vol.Required("qty"): vol.All(int, vol.Range(min=0)),
    })
    @websocket_api.async_response
    async def handle_set_qty(hass, connection, msg):
        """Set quantity for a product."""
        manager = hass.data[DOMAIN]["manager"]
        try:
            await manager.async_set_qty(key=msg["key"], qty=msg["qty"])
            connection.send_result(msg["id"], {"success": True})
        except InvariantError as err:
            _LOGGER.warning("Invariant violation in set_qty: %s", err)
            connection.send_error(msg["id"], "invariant_violation", str(err))
        except Exception as err:
            _LOGGER.error("Error setting quantity: %s", err)
            connection.send_error(msg["id"], "set_qty_failed", str(err))
    
    @websocket_api.websocket_command({
        vol.Required("type"): "shopping_list_manager/get_products",
    })
    @websocket_api.async_response
    async def handle_get_products(hass, connection, msg):
        """Get all products."""
        manager = hass.data[DOMAIN]["manager"]
        try:
            products = await manager.async_get_products()
            connection.send_result(msg["id"], products)
        except Exception as err:
            _LOGGER.error("Error getting products: %s", err)
            connection.send_error(msg["id"], "get_products_failed", str(err))
    
    @websocket_api.websocket_command({
        vol.Required("type"): "shopping_list_manager/get_active",
    })
    @websocket_api.async_response
    async def handle_get_active(hass, connection, msg):
        """Get active shopping list."""
        manager = hass.data[DOMAIN]["manager"]
        try:
            active = await manager.async_get_active()
            connection.send_result(msg["id"], active)
        except Exception as err:
            _LOGGER.error("Error getting active list: %s", err)
            connection.send_error(msg["id"], "get_active_failed", str(err))
    
    @websocket_api.websocket_command({
        vol.Required("type"): "shopping_list_manager/delete_product",
        vol.Required("key"): str,
    })
    @websocket_api.async_response
    async def handle_delete_product(hass, connection, msg):
        """Delete a product."""
        manager = hass.data[DOMAIN]["manager"]
        try:
            await manager.async_delete_product(key=msg["key"])
            connection.send_result(msg["id"], {"success": True})
        except Exception as err:
            _LOGGER.error("Error deleting product: %s", err)
            connection.send_error(msg["id"], "delete_product_failed", str(err))
    
    # Register all commands with Home Assistant
    websocket_api.async_register_command(hass, handle_add_product)
    websocket_api.async_register_command(hass, handle_set_qty)
    websocket_api.async_register_command(hass, handle_get_products)
    websocket_api.async_register_command(hass, handle_get_active)
    websocket_api.async_register_command(hass, handle_delete_product)
    
    _LOGGER.info("Registered 5 WebSocket commands for Shopping List Manager")