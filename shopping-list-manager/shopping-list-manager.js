/*
 * Shopping List Manager Card v3.0
 * Complete version with custom products, images, and layout options
 * 
 * Features:
 * - Add custom products with images
 * - Grid or List layout
 * - Customizable colors
 * - Recently used items
 * - Search functionality
 * - Auto-categorization
 */

class ShoppingListManager extends HTMLElement {
  constructor() {
    super();
    this.attachShadow({ mode: 'open' });
    this._lastUpdate = null;
    this._collapsedSections = new Set();
    this._collapsedRecent = false;
    this._products = this._getProductDatabase();
    this._customProducts = {}; // Will be loaded asynchronously
    this._showAddDialog = false;
    this._pendingProduct = null;
    this._selectedSuggestionIndex = -1;
    this._customProductsLoaded = false;
  }

  setConfig(config) {
    if (!config.todo_list) {
      throw new Error('You must define a todo_list entity_id.');
    }
    this._config = {
      columns: 'auto',
      layout: 'grid',
      primary_color: '#667eea',
      secondary_color: '#764ba2',
      recent_color: '#ffebee',
      ...config
    };
  }

  set hass(hass) {
    this._hass = hass;
    
    const state = hass.states[this._config.todo_list];
    if (!state) return;
    
    if (this._lastUpdate !== state.last_updated) {
      this._lastUpdate = state.last_updated;
      this._render();
    } else if (!this.shadowRoot.innerHTML) {
      this._render();
    }
  }

  _escapeHtml(text) {
    if (text == null) return '';
    const div = document.createElement('div');
    div.textContent = text;
    return div.innerHTML;
  }

  _escapeHtmlAttr(text) {
    if (text == null) return '';
    return String(text)
      .replace(/&/g, '&amp;')
      .replace(/"/g, '&quot;')
      .replace(/'/g, '&#39;')
      .replace(/</g, '&lt;')
      .replace(/>/g, '&gt;');
  }

  _getProductDatabase() {
    return {
      "Fruit & Vegetables": [
        { name: "🍎 Apples", icon: "mdi:food-apple" },
        { name: "🍌 Bananas", icon: "mdi:fruit-banana" },
        { name: "🥝 Kiwifruit", icon: "mdi:fruit-kiwi" },
        { name: "🟢 Feijoas", icon: "mdi:fruit-grapes" },
        { name: "🍊 Oranges", icon: "mdi:fruit-citrus" },
        { name: "🍓 Strawberries", icon: "mdi:fruit-strawberry" },
        { name: "🍇 Grapes", icon: "mdi:fruit-grapes" },
        { name: "🍅 Tomatoes", icon: "mdi:food-tomato" },
        { name: "🍠 Kūmara", icon: "mdi:sweet-potato" },
        { name: "🥔 Potatoes", icon: "mdi:potato" },
        { name: "🥕 Carrots", icon: "mdi:carrot" },
        { name: "🥦 Broccoli", icon: "mdi:food-broccoli" },
        { name: "🥬 Lettuce", icon: "mdi:food-lettuce" },
        { name: "🧅 Onions", icon: "mdi:onion" },
        { name: "🥒 Cucumber", icon: "mdi:cucumber" },
        { name: "🫑 Bell Peppers", icon: "mdi:bell-pepper" },
        { name: "🥑 Avocado", icon: "mdi:fruit-avocado" },
        { name: "🎃 Pumpkin", icon: "mdi:pumpkin" }
      ],
      "Fridge, Delivery & Eggs": [
        { name: "🥛 Milk", icon: "mdi:cup" },
        { name: "🥚 Eggs", icon: "mdi:egg" },
        { name: "🧈 Butter", icon: "mdi:butter" },
        { name: "🧀 Cheese", icon: "mdi:cheese" },
        { name: "🍦 Yogurt", icon: "mdi:cup-water" },
        { name: "🍶 Cream", icon: "mdi:cup" },
        { name: "🥣 Hummus/Dips", icon: "mdi:bowl-mix" }
      ],
      "Bread & Bakery": [
        { name: "🍞 Bread", icon: "mdi:baguette" },
        { name: "🥯 Bagels", icon: "mdi:food-croissant" },
        { name: "🥐 Croissants", icon: "mdi:food-croissant" },
        { name: "🧁 Muffins", icon: "mdi:cupcake" },
        { name: "🥧 Meat Pies", icon: "mdi:pie" }
      ],
      "Meat & Fish": [
        { name: "🍗 Chicken Breast", icon: "mdi:food-drumstick" },
        { name: "🥩 Ground Beef/Mince", icon: "mdi:food-steak" },
        { name: "🐑 Lamb Chops", icon: "mdi:food-steak" },
        { name: "🐟 Salmon/Fish", icon: "mdi:fish" },
        { name: "🥓 Bacon", icon: "mdi:food-steak" },
        { name: "🌭 Sausages", icon: "mdi:hot-dog" }
      ],
      "Pasta, Rice & Canned Food": [
        { name: "🍝 Pasta", icon: "mdi:pasta" },
        { name: "🍚 Rice", icon: "mdi:rice" },
        { name: "🥫 Tomato Sauce", icon: "mdi:bottle-tonic-plus" },
        { name: "🥫 Canned Tomatoes", icon: "mdi:can" },
        { name: "🫘 Baked Beans", icon: "mdi:bowl-mix" },
        { name: "🍯 Marmite/Vegemite", icon: "mdi:glass-stange" },
        { name: "🍯 Mānuka Honey", icon: "mdi:clover" },
        { name: "🥣 Onion Soup Mix", icon: "mdi:cup-glow" }
      ],
      "Frozen": [
        { name: "🍨 Ice Cream", icon: "mdi:ice-cream" },
        { name: "🍦 Tip Top Hokey Pokey", icon: "mdi:ice-cream" },
        { name: "🍕 Frozen Pizza", icon: "mdi:pizza" },
        { name: "❄️ Frozen Vegetables", icon: "mdi:snowflake" },
        { name: "🍟 Oven Chips", icon: "mdi:french-fries" }
      ],
      "Sweets & Snacks": [
        { name: "🍫 Chocolate Block", icon: "mdi:food-candy" },
        { name: "🍪 Cookies/Biscuits", icon: "mdi:cookie" },
        { name: "🍟 Chips", icon: "mdi:food-chips" },
        { name: "🍿 Popcorn", icon: "mdi:popcorn" },
        { name: "🍬 Lollies", icon: "mdi:candycane" },
        { name: "🍫 Muesli Bars", icon: "mdi:rhombus-split" }
      ],
      "Drinks": [
        { name: "💧 Water", icon: "mdi:water" },
        { name: "🧃 Orange Juice", icon: "mdi:cup" },
        { name: "☕ Coffee", icon: "mdi:coffee" },
        { name: "🍵 Tea", icon: "mdi:tea" },
        { name: "🥤 Soda/L&P", icon: "mdi:bottle-soda" },
        { name: "🍺 Beer/Cider", icon: "mdi:beer" },
        { name: "🍷 Wine", icon: "mdi:glass-wine" }
      ],
      "Household & Cleaning": [
        { name: "🧻 Paper Towels", icon: "mdi:paper-roll" },
        { name: "🚽 Toilet Paper", icon: "mdi:toilet" },
        { name: "🧼 Dish Soap", icon: "mdi:spray-bottle" },
        { name: "🧺 Laundry Powder", icon: "mdi:washing-machine" },
        { name: "🗑️ Trash Bags", icon: "mdi:delete" }
      ],
      "Personal Care": [
        { name: "🧴 Shampoo/Conditioner", icon: "mdi:shower" },
        { name: "🧼 Soap/Body Wash", icon: "mdi:spray-bottle" },
        { name: "🪥 Toothpaste", icon: "mdi:tooth" },
        { name: "☀️ Sunscreen", icon: "mdi:sun-side" }
      ]
    };
  }

  async _loadCustomProducts() {
    if (this._customProductsLoaded) return;
    
    // Try to load from shared file first
    try {
      const response = await fetch('/local/community/shopping-list-manager/custom-products.json?t=' + Date.now());
      if (response.ok) {
        const data = await response.json();
        this._customProducts = data || {};
        this._customProductsLoaded = true;
        return;
      }
    } catch (e) {
      console.log('Could not load custom products from file, checking localStorage...', e);
    }
    
    // Fallback to localStorage for backward compatibility
    const saved = localStorage.getItem('shopping-list-custom-products');
    if (saved) {
      try {
        this._customProducts = JSON.parse(saved);
      } catch (e) {
        this._customProducts = {};
      }
    }
    this._customProductsLoaded = true;
  }

  async _saveCustomProducts() {
    if (!this._hass) return;
    
    const jsonData = JSON.stringify(this._customProducts, null, 2);
    
    // Try shell_command
    try {
      await this._hass.callService('shell_command', 'write_shopping_list', {
        data: jsonData
      });
      console.log('✅ Custom products saved to shared file via shell_command');
      this._customProductsLoaded = false;
    } catch (e) {
      console.warn('⚠️ Shell command failed:', e);
      console.warn('Make sure you have this in configuration.yaml:');
      console.warn('shell_command:\n  write_shopping_list: "echo \'{{ data }}\' > /config/www/community/shopping-list-manager/custom-products.json"');
    }
    
    // Always save to localStorage as backup
    localStorage.setItem('shopping-list-custom-products', jsonData);
  }


  _getAllProducts() {
    const all = JSON.parse(JSON.stringify(this._products));
    
    for (const [category, products] of Object.entries(this._customProducts)) {
      if (!all[category]) all[category] = [];
      all[category] = [...all[category], ...products];
    }
    
    return all;
  }

  async _render() {
    if (!this._config || !this._hass) return;

    // Load custom products if not already loaded
    if (!this._customProductsLoaded) {
      await this._loadCustomProducts();
    }

    const state = this._hass.states[this._config.todo_list];
    if (!state) {
      this.shadowRoot.innerHTML = `<ha-card><div style="padding: 16px;">Entity not found: ${this._config.todo_list}</div></ha-card>`;
      return;
    }

    let currentItems = [];
    try {
      const res = await this._hass.callWS({
        type: 'todo/item/list',
        entity_id: this._config.todo_list
      });
      currentItems = res.items
        .filter(item => item.status === 'needs_action')
        .map(item => item.summary);
    } catch (e) {
      console.error('Error fetching items', e);
    }

    const allProducts = this._getAllProducts();
    const groupedItems = this._groupItemsByCategory(currentItems, allProducts);
    const recentItems = this._getRecentItems();

    const gridColumns = this._config.columns === 'auto' 
      ? 'repeat(auto-fill, minmax(100px, 1fr))' 
      : `repeat(${this._config.columns}, 1fr)`;

    this.shadowRoot.innerHTML = `
      <style>
        ha-card { overflow: visible; }
        .card-header {
          padding: 16px;
          background: linear-gradient(135deg, ${this._config.primary_color} 0%, ${this._config.secondary_color} 100%);
          color: white;
          font-size: 18px;
          font-weight: 600;
        }
        .search-section {
          padding: 16px;
          border-bottom: 1px solid var(--divider-color);
          background: var(--card-background-color);
        }
        .search-box { position: relative; }
        .search-input {
          width: 100%;
          padding: 12px 40px 12px 12px;
          border: 2px solid var(--divider-color);
          border-radius: 8px;
          font-size: 14px;
          background: var(--card-background-color);
          color: var(--primary-text-color);
          box-sizing: border-box;
        }
        .search-input:focus {
          outline: none;
          border-color: ${this._config.primary_color};
        }
        .search-icon {
          position: absolute;
          right: 12px;
          top: 50%;
          transform: translateY(-50%);
          color: var(--secondary-text-color);
          pointer-events: none;
        }
        .suggestions {
          position: absolute;
          top: 100%;
          left: 0;
          right: 0;
          background: var(--card-background-color);
          border: 2px solid ${this._config.primary_color};
          border-top: none;
          border-radius: 0 0 8px 8px;
          max-height: 300px;
          overflow-y: auto;
          z-index: 1000;
          box-shadow: 0 4px 12px rgba(0,0,0,0.15);
        }
        .suggestion-item {
          padding: 12px;
          cursor: pointer;
          display: flex;
          align-items: center;
          gap: 12px;
          border-bottom: 1px solid var(--divider-color);
        }
        .suggestion-item:hover {
          background: var(--secondary-background-color);
        }
        .suggestion-item.add-new {
          background: #e8f5e9;
          font-weight: 600;
          color: #2e7d32;
        }
        .suggestion-item.add-new:hover {
          background: #c8e6c9;
        }
        .suggestion-icon { font-size: 24px; }
        .suggestion-image {
          width: 32px;
          height: 32px;
          object-fit: contain;
        }
        .suggestion-text { flex-grow: 1; }
        .suggestion-name {
          font-weight: 500;
          color: var(--primary-text-color);
        }
        .suggestion-category {
          font-size: 12px;
          color: var(--secondary-text-color);
        }
        
        .recent-section {
          background: ${this._config.recent_color};
          border-bottom: 1px solid #ffcdd2;
        }
        .recent-section .section-title {
          color: #c62828;
        }
        .recent-section .section-count {
          background: #ef9a9a;
          color: #b71c1c;
        }
        .recent-section .expand-icon {
          color: #c62828;
        }
        .section {
          border-bottom: 1px solid var(--divider-color);
        }
        .section-header {
          display: flex;
          align-items: center;
          justify-content: space-between;
          padding: 12px 16px;
          cursor: pointer;
          user-select: none;
          background: var(--card-background-color);
          transition: background 0.2s;
        }
        .recent-section .section-header {
          background: ${this._config.recent_color};
        }
        .section-header:hover {
          background: var(--secondary-background-color);
        }
        .recent-section .section-header:hover {
          background: #ffcdd2;
        }
        .section-title {
          display: flex;
          align-items: center;
          gap: 8px;
          font-weight: 600;
          font-size: 14px;
          color: var(--primary-text-color);
        }
        .section-count {
          background: rgba(0,0,0,0.1);
          padding: 2px 8px;
          border-radius: 12px;
          font-size: 12px;
        }
        .expand-icon {
          transition: transform 0.3s;
        }
        .expand-icon.collapsed {
          transform: rotate(-90deg);
        }
        .section-content {
          ${this._config.layout === 'list' ? '' : `
            display: grid;
            grid-template-columns: ${gridColumns};
            gap: 8px;
          `}
          padding: 12px;
          background: var(--card-background-color);
        }
        .section-content.collapsed {
          display: none;
        }
        
        .product-card {
          ${this._config.layout === 'grid' ? 'aspect-ratio: 1;' : ''}
          border: 2px solid var(--divider-color);
          border-radius: 8px;
          display: flex;
          ${this._config.layout === 'grid' ? 'flex-direction: column;' : 'flex-direction: row;'}
          align-items: center;
          ${this._config.layout === 'grid' ? 'justify-content: center;' : 'justify-content: flex-start;'}
          cursor: pointer;
          transition: all 0.2s;
          padding: 8px;
          background: var(--card-background-color);
          ${this._config.layout === 'list' ? 'margin-bottom: 8px;' : ''}
          position: relative;
        }
        .product-card:hover {
          border-color: ${this._config.primary_color};
          transform: translateY(-2px);
          box-shadow: 0 4px 12px rgba(102, 126, 234, 0.2);
        }
        .product-card.on-list {
          border-color: #4caf50;
          background: #e8f5e9;
        }
        .product-image {
          ${this._config.layout === 'grid' ? 'width: 48px; height: 48px;' : 'width: 40px; height: 40px;'}
          object-fit: contain;
          ${this._config.layout === 'grid' ? 'margin-bottom: 4px;' : 'margin-right: 12px;'}
        }
        .product-icon {
          ${this._config.layout === 'grid' ? 'font-size: 32px; margin-bottom: 4px;' : 'font-size: 28px; margin-right: 12px;'}
        }
        .product-name {
          font-size: ${this._config.layout === 'grid' ? '11px' : '14px'};
          ${this._config.layout === 'grid' ? 'text-align: center;' : 'text-align: left; flex-grow: 1;'}
          font-weight: 500;
          color: var(--primary-text-color);
          line-height: 1.2;
        }
        .empty-state {
          padding: 32px;
          text-align: center;
          color: var(--secondary-text-color);
        }

        .dialog-overlay {
          position: fixed;
          top: 0;
          left: 0;
          right: 0;
          bottom: 0;
          background: rgba(0,0,0,0.5);
          display: flex;
          align-items: center;
          justify-content: center;
          z-index: 2000;
        }
        .dialog {
          background: var(--card-background-color);
          border-radius: 12px;
          padding: 24px;
          width: 90%;
          max-width: 500px;
          max-height: 80vh;
          overflow-y: auto;
        }
        .dialog-header {
          font-size: 20px;
          font-weight: 600;
          margin-bottom: 16px;
          color: var(--primary-text-color);
        }
        .form-group {
          margin-bottom: 16px;
        }
        .form-label {
          display: block;
          margin-bottom: 4px;
          font-weight: 500;
          font-size: 14px;
          color: var(--primary-text-color);
        }
        .form-input {
          width: 100%;
          padding: 10px;
          border: 2px solid var(--divider-color);
          border-radius: 6px;
          font-size: 14px;
          background: var(--card-background-color);
          color: var(--primary-text-color);
          box-sizing: border-box;
        }
        .form-input:focus {
          outline: none;
          border-color: ${this._config.primary_color};
        }
        .form-select {
          width: 100%;
          padding: 10px;
          border: 2px solid var(--divider-color);
          border-radius: 6px;
          font-size: 14px;
          background: var(--card-background-color);
          color: var(--primary-text-color);
          box-sizing: border-box;
        }
        .dialog-actions {
          display: flex;
          gap: 8px;
          justify-content: flex-end;
          margin-top: 20px;
        }
        .btn {
          padding: 10px 20px;
          border: none;
          border-radius: 6px;
          font-weight: 600;
          cursor: pointer;
          transition: transform 0.2s;
        }
        .btn:hover {
          transform: translateY(-2px);
        }
        .btn-primary {
          background: linear-gradient(135deg, ${this._config.primary_color} 0%, ${this._config.secondary_color} 100%);
          color: white;
        }
        .btn-secondary {
          background: var(--secondary-background-color);
          color: var(--primary-text-color);
        }
        .image-preview {
          margin-top: 8px;
          max-width: 100px;
          max-height: 100px;
          object-fit: contain;
          border: 2px solid var(--divider-color);
          border-radius: 6px;
          padding: 4px;
        }
      </style>

      <ha-card>
        <div class="card-header">🛒 Shopping List</div>
        
        <div class="search-section">
          <div class="search-box">
            <input 
              type="text" 
              class="search-input" 
              placeholder="Search or add new product..."
              id="searchInput"
            />
            <ha-icon class="search-icon" icon="mdi:magnify"></ha-icon>
            <div class="suggestions" id="suggestions" style="display: none;"></div>
          </div>
        </div>

        ${recentItems.length > 0 ? this._renderRecentSection(recentItems, currentItems) : ''}
        ${this._renderCategories(groupedItems, allProducts, currentItems)}
      </ha-card>

      ${this._showAddDialog ? this._renderAddDialog() : ''}
    `;

    this._attachEventListeners();
  }

  _renderAddDialog() {
    const categories = ['Fruit & Vegetables', 'Fridge, Delivery & Eggs', 'Bread & Bakery', 
                       'Meat & Fish', 'Pasta, Rice & Canned Food', 'Frozen', 'Sweets & Snacks', 
                       'Drinks', 'Household & Cleaning', 'Personal Care', 'Other'];

    return `
      <div class="dialog-overlay" id="dialogOverlay">
        <div class="dialog">
          <div class="dialog-header">➕ Add New Product</div>
          
          <div class="form-group">
            <label class="form-label">Product Name *</label>
            <input type="text" class="form-input" id="newProductName" value="${this._pendingProduct || ''}" />
          </div>

          <div class="form-group">
            <label class="form-label">Category *</label>
            <select class="form-select" id="newProductCategory">
              ${categories.map(cat => `<option value="${cat}">${cat}</option>`).join('')}
            </select>
          </div>

          <div class="form-group">
            <label class="form-label">Icon (MDI)</label>
            <input type="text" class="form-input" id="newProductIcon" placeholder="e.g., mdi:cart" value="mdi:cart" />
            <div style="font-size: 11px; color: var(--secondary-text-color); margin-top: 4px;">
              Find icons at: pictogrammers.com/library/mdi
            </div>
          </div>

          <div class="form-group">
            <label class="form-label">Image URL (Optional)</label>
            <input type="text" class="form-input" id="newProductImage" placeholder="/local/shopping/product.png" />
            <img id="imagePreview" class="image-preview" style="display: none;" />
            <div style="font-size: 11px; color: var(--secondary-text-color); margin-top: 4px;">
              Use /local/ for images in /config/www/ folder
            </div>
          </div>

          <div class="dialog-actions">
            <button class="btn btn-secondary" id="cancelBtn">Cancel</button>
            <button class="btn btn-primary" id="saveBtn">Save & Add to List</button>
          </div>
        </div>
      </div>
    `;
  }

  _renderRecentSection(recentItems, currentItems) {
    const isCollapsed = this._collapsedRecent;
    return `
      <div class="section recent-section">
        <div class="section-header" data-section="recent">
          <div class="section-title">
            <span>📌</span>
            <span>Recently Used</span>
            <span class="section-count">${recentItems.length}</span>
          </div>
          <ha-icon class="expand-icon ${isCollapsed ? 'collapsed' : ''}" icon="mdi:chevron-down"></ha-icon>
        </div>
        <div class="section-content ${isCollapsed ? 'collapsed' : ''}">
          ${recentItems.map(item => this._renderProductCard(item, currentItems)).join('')}
        </div>
      </div>
    `;
  }

  _renderCategories(groupedItems, allProducts, currentItems) {
    const categories = Object.keys(allProducts);
    
    const html = categories
      .filter(category => groupedItems[category] && groupedItems[category].length > 0)
      .map(category => {
        const items = groupedItems[category];
        const isCollapsed = this._collapsedSections.has(category);
        const emoji = this._getCategoryEmoji(category);
        
        return `
          <div class="section">
            <div class="section-header" data-section="${category}">
              <div class="section-title">
                <span>${emoji}</span>
                <span>${this._escapeHtml(category)}</span>
                <span class="section-count">${items.length}</span>
              </div>
              <ha-icon class="expand-icon ${isCollapsed ? 'collapsed' : ''}" icon="mdi:chevron-down"></ha-icon>
            </div>
            <div class="section-content ${isCollapsed ? 'collapsed' : ''}">
              ${items.map(item => this._renderProductCard(item, currentItems, true)).join('')}
            </div>
          </div>
        `;
      }).join('');
      
    return html || '<div class="empty-state">No items on your list. Search above to add items!</div>';
  }

  _renderProductCard(item, currentItems, onList = false) {
    const isOnList = onList || currentItems.some(i => i.toLowerCase() === item.name.toLowerCase());
    const escapedName = this._escapeHtmlAttr(item.name || '');
    const escapedCategory = this._escapeHtmlAttr(item.category || '');
    const escapedIcon = this._escapeHtmlAttr(item.icon || '');
    const escapedImage = item.image ? this._escapeHtmlAttr(item.image) : '';
    
    if (item.image) {
      return `
        <div class="product-card ${isOnList ? 'on-list' : ''}" data-product="${escapedName}" data-category="${escapedCategory}" data-icon="${escapedIcon}" data-image="${escapedImage}">
          <img src="${escapedImage}" class="product-image" alt="${escapedName}" onerror="this.style.display='none'; this.nextElementSibling.style.display='block';" />
          <ha-icon class="product-icon" icon="${escapedIcon}" style="display: none;"></ha-icon>
          <div class="product-name">${this._escapeHtml(item.name)}</div>
        </div>
      `;
    } else {
      return `
        <div class="product-card ${isOnList ? 'on-list' : ''}" data-product="${escapedName}" data-category="${escapedCategory}" data-icon="${escapedIcon}">
          <ha-icon class="product-icon" icon="${escapedIcon}"></ha-icon>
          <div class="product-name">${this._escapeHtml(item.name)}</div>
        </div>
      `;
    }
  }

  _getCategoryEmoji(category) {
    const emojiMap = {
      'Fruit & Vegetables': '🥬',
      'Fridge, Delivery & Eggs': '🥛',
      'Bread & Bakery': '🥖',
      'Meat & Fish': '🥩',
      'Pasta, Rice & Canned Food': '🍝',
      'Frozen': '🧊',
      'Sweets & Snacks': '🍫',
      'Drinks': '🥤',
      'Household & Cleaning': '🧹',
      'Personal Care': '🧴',
      'Other': '📦'
    };
    return emojiMap[category] || '📦';
  }

  _groupItemsByCategory(currentItems, allProducts) {
    const grouped = {};
    
    currentItems.forEach(itemName => {
      for (const [category, products] of Object.entries(allProducts)) {
        const product = products.find(p => p.name.toLowerCase() === itemName.toLowerCase());
        if (product) {
          if (!grouped[category]) grouped[category] = [];
          grouped[category].push(product);
          break;
        }
      }
    });
    
    return grouped;
  }

  _getRecentItems() {
    const recent = localStorage.getItem('shopping-list-recent');
    if (!recent) return [];
    
    try {
      return JSON.parse(recent).slice(0, 10);
    } catch (e) {
      return [];
    }
  }

  _addToRecent(name, category, icon, image) {
    const recent = this._getRecentItems();
    const filtered = recent.filter(item => item.name !== name);
    const item = { name, category, icon };
    if (image) item.image = image;
    filtered.unshift(item);
    const toSave = filtered.slice(0, 10);
    localStorage.setItem('shopping-list-recent', JSON.stringify(toSave));
  }

  _attachEventListeners() {
    const searchInput = this.shadowRoot.getElementById('searchInput');
    const suggestions = this.shadowRoot.getElementById('suggestions');

    searchInput.addEventListener('input', (e) => {
      const query = e.target.value.trim();
      
      if (query.length < 2) {
        suggestions.style.display = 'none';
        return;
      }

      const allProducts = this._getAllProducts();
      const results = [];
      for (const [category, products] of Object.entries(allProducts)) {
        products.forEach(product => {
          if (product.name.toLowerCase().includes(query.toLowerCase())) {
            results.push({ ...product, category });
          }
        });
      }

      let html = '';
      if (results.length > 0) {
        html = results.slice(0, 8).map(item => {
          const escapedName = this._escapeHtmlAttr(item.name || '');
          const escapedCategory = this._escapeHtmlAttr(item.category || '');
          const escapedIcon = this._escapeHtmlAttr(item.icon || '');
          const escapedImage = item.image ? this._escapeHtmlAttr(item.image) : '';
          const imageHtml = item.image 
            ? `<img src="${escapedImage}" class="suggestion-image" alt="${escapedName}" onerror="this.style.display='none'; this.nextElementSibling.style.display='block';" /><ha-icon class="suggestion-icon" icon="${escapedIcon}" style="display: none;"></ha-icon>`
            : `<ha-icon class="suggestion-icon" icon="${escapedIcon}"></ha-icon>`;
          
          return `
            <div class="suggestion-item" data-name="${escapedName}" data-category="${escapedCategory}" data-icon="${escapedIcon}" data-image="${escapedImage}">
              ${imageHtml}
              <div class="suggestion-text">
                <div class="suggestion-name">${this._escapeHtml(item.name)}</div>
                <div class="suggestion-category">${this._escapeHtml(item.category)}</div>
              </div>
            </div>
          `;
        }).join('');
      }
      
      const escapedQuery = this._escapeHtmlAttr(query);
      html += `
        <div class="suggestion-item add-new" data-new="${escapedQuery}">
          <ha-icon class="suggestion-icon" icon="mdi:plus-circle"></ha-icon>
          <div class="suggestion-text">
            <div class="suggestion-name">Add "${this._escapeHtml(query)}" as new product</div>
          </div>
        </div>
      `;

      suggestions.innerHTML = html;
      suggestions.style.display = 'block';
      this._selectedSuggestionIndex = -1;

      const suggestionItems = suggestions.querySelectorAll('.suggestion-item');
      const handleSuggestionClick = (el) => {
        if (el.dataset.new) {
          this._pendingProduct = el.dataset.new;
          this._showAddDialog = true;
          this._render();
        } else {
          const name = el.dataset.name;
          const category = el.dataset.category;
          const icon = el.dataset.icon;
          const image = el.dataset.image;
          this._addItem(name);
          this._addToRecent(name, category, icon, image);
          searchInput.value = '';
          suggestions.style.display = 'none';
          this._selectedSuggestionIndex = -1;
        }
      };

      suggestionItems.forEach((el, index) => {
        el.addEventListener('click', () => handleSuggestionClick(el));
        el.setAttribute('tabindex', '0');
        el.setAttribute('role', 'option');
      });

      // Keyboard navigation for search
      searchInput.addEventListener('keydown', (e) => {
        if (!suggestions || suggestions.style.display === 'none') return;

        const items = suggestions.querySelectorAll('.suggestion-item');
        if (items.length === 0) return;

        switch (e.key) {
          case 'ArrowDown':
            e.preventDefault();
            this._selectedSuggestionIndex = Math.min(this._selectedSuggestionIndex + 1, items.length - 1);
            items[this._selectedSuggestionIndex].scrollIntoView({ block: 'nearest', behavior: 'smooth' });
            items[this._selectedSuggestionIndex].focus();
            break;
          case 'ArrowUp':
            e.preventDefault();
            this._selectedSuggestionIndex = Math.max(this._selectedSuggestionIndex - 1, -1);
            if (this._selectedSuggestionIndex >= 0) {
              items[this._selectedSuggestionIndex].scrollIntoView({ block: 'nearest', behavior: 'smooth' });
              items[this._selectedSuggestionIndex].focus();
            } else {
              searchInput.focus();
            }
            break;
          case 'Enter':
            e.preventDefault();
            if (this._selectedSuggestionIndex >= 0 && items[this._selectedSuggestionIndex]) {
              handleSuggestionClick(items[this._selectedSuggestionIndex]);
            } else if (items.length > 0) {
              handleSuggestionClick(items[0]);
            }
            break;
          case 'Escape':
            e.preventDefault();
            suggestions.style.display = 'none';
            this._selectedSuggestionIndex = -1;
            searchInput.value = '';
            searchInput.focus();
            break;
        }
      });

      suggestions.setAttribute('role', 'listbox');
      suggestions.setAttribute('aria-label', 'Search suggestions');
    });

    // Store reference to cleanup listener later
    this._outsideClickHandler = (e) => {
      if (suggestions && suggestions.style.display !== 'none' && 
          !this.shadowRoot.querySelector('.search-section').contains(e.target)) {
        suggestions.style.display = 'none';
      }
    };
    document.addEventListener('click', this._outsideClickHandler);

    this.shadowRoot.querySelectorAll('.section-header').forEach(header => {
      header.addEventListener('click', () => {
        const section = header.dataset.section;
        const content = header.nextElementSibling;
        const icon = header.querySelector('.expand-icon');
        
        content.classList.toggle('collapsed');
        icon.classList.toggle('collapsed');

        if (section === 'recent') {
          this._collapsedRecent = content.classList.contains('collapsed');
        } else {
          if (this._collapsedSections.has(section)) {
            this._collapsedSections.delete(section);
          } else {
            this._collapsedSections.add(section);
          }
        }
      });
    });

    this.shadowRoot.querySelectorAll('.product-card').forEach(card => {
      card.addEventListener('click', () => {
        const name = card.dataset.product;
        const isOnList = card.classList.contains('on-list');
        
        if (isOnList) {
          this._removeItem(name);
        } else {
          const category = card.dataset.category;
          const icon = card.dataset.icon;
          const image = card.dataset.image;
          this._addItem(name);
          this._addToRecent(name, category, icon, image);
        }
      });
    });

    if (this._showAddDialog) {
      const overlay = this.shadowRoot.getElementById('dialogOverlay');
      const cancelBtn = this.shadowRoot.getElementById('cancelBtn');
      const saveBtn = this.shadowRoot.getElementById('saveBtn');
      const imageInput = this.shadowRoot.getElementById('newProductImage');
      const imagePreview = this.shadowRoot.getElementById('imagePreview');

      imageInput.addEventListener('input', (e) => {
        if (e.target.value) {
          imagePreview.src = e.target.value;
          imagePreview.style.display = 'block';
          imagePreview.onerror = () => { imagePreview.style.display = 'none'; };
        } else {
          imagePreview.style.display = 'none';
        }
      });

      overlay.addEventListener('click', (e) => {
        if (e.target === overlay) {
          this._showAddDialog = false;
          this._pendingProduct = null;
          this._render();
        }
      });

      const closeDialog = () => {
        this._showAddDialog = false;
        this._pendingProduct = null;
        this._render();
      };

      cancelBtn.addEventListener('click', closeDialog);

      // Keyboard support for dialog
      const dialogKeydown = (e) => {
        if (e.key === 'Escape') {
          e.preventDefault();
          closeDialog();
        } else if (e.key === 'Enter' && (e.ctrlKey || e.metaKey)) {
          e.preventDefault();
          saveBtn.click();
        }
      };
      overlay.addEventListener('keydown', dialogKeydown);
      
      // Focus first input when dialog opens
      const nameInput = this.shadowRoot.getElementById('newProductName');
      if (nameInput) {
        setTimeout(() => nameInput.focus(), 100);
      }

      saveBtn.addEventListener('click', () => {
        const name = this.shadowRoot.getElementById('newProductName').value.trim();
        const category = this.shadowRoot.getElementById('newProductCategory').value;
        const icon = this.shadowRoot.getElementById('newProductIcon').value.trim() || 'mdi:cart';
        const image = this.shadowRoot.getElementById('newProductImage').value.trim();

        if (!name) {
          // Better error feedback - could use HA notification service in future
          const nameInput = this.shadowRoot.getElementById('newProductName');
          nameInput.style.borderColor = '#f44336';
          nameInput.focus();
          setTimeout(() => {
            if (nameInput) nameInput.style.borderColor = '';
          }, 3000);
          return;
        }

        if (!this._customProducts[category]) {
          this._customProducts[category] = [];
        }

        const newProduct = { name, icon };
        if (image) newProduct.image = image;

        this._customProducts[category].push(newProduct);
        this._saveCustomProducts();

        this._addItem(name);
        this._addToRecent(name, category, icon, image);

        this._showAddDialog = false;
        this._pendingProduct = null;
        this._render();
      });
    }
  }

  async _addItem(name) {
    try {
      await this._hass.callService('todo', 'add_item', {
        entity_id: this._config.todo_list,
        item: name
      });
      // Force re-render to update UI
      this._lastUpdate = null;
      this._render();
    } catch (e) {
      console.error('Failed to add item:', e);
      // Could show user-friendly error notification here
    }
  }

  async _removeItem(name) {
    try {
      await this._hass.callService('todo', 'remove_item', {
        entity_id: this._config.todo_list,
        item: name
      });
      // Force re-render to update UI
      this._lastUpdate = null;
      this._render();
    } catch (e) {
      console.error('Failed to remove item:', e);
      // Could show user-friendly error notification here
    }
  }

  disconnectedCallback() {
    // Clean up event listeners to prevent memory leaks
    if (this._outsideClickHandler) {
      document.removeEventListener('click', this._outsideClickHandler);
      this._outsideClickHandler = null;
    }
  }

  getCardSize() {
    return 4;
  }

  static getConfigElement() {
    return document.createElement('shopping-list-manager-editor');
  }

  static getStubConfig() {
    return {
      type: 'custom:shopping-list-manager',
      todo_list: 'todo.shopping_list',
      layout: 'grid',
      columns: 'auto'
    };
  }
}

customElements.define('shopping-list-manager', ShoppingListManager);

class ShoppingListManagerEditor extends HTMLElement {
  setConfig(config) {
    this._config = config;
    this._render();
  }

  set hass(hass) {
    this._hass = hass;
    if (!this._rendered) this._render();
  }

  _render() {
    if (!this.shadowRoot) {
      this.attachShadow({ mode: 'open' });
    }

    this.shadowRoot.innerHTML = `
      <style>
        .row { display: flex; gap: 8px; margin-bottom: 16px; flex-wrap: wrap; }
        ha-entity-picker, ha-textfield { flex: 1; min-width: 200px; }
        .label { font-weight: 500; margin-bottom: 4px; display: block; font-size: 14px; }
        select {
          width: 100%;
          padding: 8px;
          border: 1px solid var(--divider-color);
          border-radius: 4px;
          background: var(--card-background-color);
          color: var(--primary-text-color);
          font-size: 14px;
        }
        .form-group { flex: 1; min-width: 200px; }
      </style>
      <div class="row">
        <ha-entity-picker id="todo_list" label="To-Do List Entity" required style="flex: 1 1 100%;"></ha-entity-picker>
      </div>
      <div class="row">
        <div class="form-group">
          <label class="label">Layout</label>
          <select id="layout">
            <option value="grid">Grid (Tiles)</option>
            <option value="list">List (Rows)</option>
          </select>
        </div>
        <div class="form-group">
          <label class="label">Columns (Grid only)</label>
          <select id="columns">
            <option value="auto">Auto</option>
            <option value="3">3</option>
            <option value="4">4</option>
            <option value="5">5</option>
            <option value="6">6</option>
            <option value="8">8</option>
          </select>
        </div>
      </div>
      <div class="row">
        <ha-textfield id="primary_color" label="Primary Color" value="#667eea"></ha-textfield>
        <ha-textfield id="secondary_color" label="Secondary Color" value="#764ba2"></ha-textfield>
      </div>
      <div class="row">
        <ha-textfield id="recent_color" label="Recent Section Color" value="#ffebee"></ha-textfield>
      </div>
    `;

    const ep = this.shadowRoot.querySelector('#todo_list');
    const layoutSel = this.shadowRoot.querySelector('#layout');
    const columnsSel = this.shadowRoot.querySelector('#columns');
    const primaryColor = this.shadowRoot.querySelector('#primary_color');
    const secondaryColor = this.shadowRoot.querySelector('#secondary_color');
    const recentColor = this.shadowRoot.querySelector('#recent_color');

    if (this._hass) {
      ep.hass = this._hass;
      ep.includeDomains = ['todo'];
      ep.value = this._config?.todo_list || '';

      layoutSel.value = this._config?.layout || 'grid';
      columnsSel.value = this._config?.columns || 'auto';
      primaryColor.value = this._config?.primary_color || '#667eea';
      secondaryColor.value = this._config?.secondary_color || '#764ba2';
      recentColor.value = this._config?.recent_color || '#ffebee';

      const updateConfig = () => {
        this._config = {
          ...this._config,
          todo_list: ep.value,
          layout: layoutSel.value,
          columns: columnsSel.value,
          primary_color: primaryColor.value,
          secondary_color: secondaryColor.value,
          recent_color: recentColor.value
        };
        this.dispatchEvent(new CustomEvent('config-changed', {
          detail: { config: this._config },
          bubbles: true,
          composed: true
        }));
      };

      ep.addEventListener('value-changed', updateConfig);
      layoutSel.addEventListener('change', updateConfig);
      columnsSel.addEventListener('change', updateConfig);
      primaryColor.addEventListener('input', updateConfig);
      secondaryColor.addEventListener('input', updateConfig);
      recentColor.addEventListener('input', updateConfig);
    }

    this._rendered = true;
  }
}

customElements.define('shopping-list-manager-editor', ShoppingListManagerEditor);

window.customCards = window.customCards || [];
window.customCards.push({
  type: 'shopping-list-manager',
  name: 'Shopping List Manager',
  preview: true,
  description: 'Complete shopping list manager with custom products and images'
});
