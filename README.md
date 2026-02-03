# HA-Shopping-List-Manager
# 🛒 Shopping List Manager Card

A powerful Home Assistant Lovelace card that transforms your shopping experience with automatic category grouping, search functionality, recent items, and a beautiful interface inspired by the Bring! app.

[![hacs_badge](https://img.shields.io/badge/HACS-Custom-orange.svg)](https://github.com/custom-components/hacs)

## ✨ Features

### 🎯 Core Features

- **Smart Search** - Search through 100+ pre-configured products or add custom items
- **Category Grouping** - Items automatically organized by category with emoji indicators
- **Recently Used** - Quick access to your most frequently added items
- **Custom Products** - Add your own products with custom icons and images
- **Flexible Layouts** - Choose between grid or list view
- **Collapsible Sections** - Expand/collapse categories to organize your shopping
- **Visual Feedback** - Items on your list are highlighted with color indicators
- **Keyboard Navigation** - Full keyboard support for accessibility (Arrow keys, Enter, Escape)

### 🎨 Customization

- Custom icons (Material Design Icons built-in)
- Custom colors for primary, secondary, and recent sections
- Product images support
- Responsive grid layout with configurable columns
- Theme-aware design that adapts to your Home Assistant theme

## 📦 Installation

### HACS (Recommended)

1. Open HACS in Home Assistant
2. Click on **Frontend**
3. Click the **⋮** menu (top right) → **Custom repositories**
4. Add repository URL: `https://github.com/thekiwismarthome/HA-Shopping-List-Manager`
5. Category: **Lovelace**
6. Click **Add**
7. Find "Shopping List Manager" and click **Download**
8. Restart Home Assistant

### Manual Installation

1. Download `shopping-list-manager.js` from the latest release
2. Copy it to `/config/www/shopping-list-manager.js`
3. Add the resource in Home Assistant:
   - Go to **Settings** → **Dashboards** → **Resources** (⋮ menu)
   - Click **+ Add Resource**
   - URL: `/local/shopping-list-manager.js`
   - Resource type: **JavaScript Module**
4. Clear browser cache and restart Home Assistant

## 🚀 Quick Start

### Basic Configuration

```yaml
type: custom:shopping-list-manager
```


## 🎨 Supported Categories

The card includes a pre-configured product database with 100+ items organized into these categories:

- 🥬 **Fruit & Vegetables** - Apples, Bananas, Tomatoes, Carrots, etc.
- 🥛 **Fridge, Delivery & Eggs** - Milk, Eggs, Cheese, Butter, etc.
- 🥖 **Bread & Bakery** - Bread, Bagels, Croissants, Muffins, etc.
- 🥩 **Meat & Fish** - Chicken, Beef, Salmon, Bacon, etc.
- 🍝 **Pasta, Rice & Canned Food** - Pasta, Rice, Canned goods, etc.
- 🧊 **Frozen** - Ice Cream, Frozen Pizza, Frozen Vegetables, etc.
- 🍫 **Sweets & Snacks** - Chocolate, Cookies, Chips, Popcorn, etc.
- 🥤 **Drinks** - Water, Juice, Coffee, Tea, Beer, Wine, etc.
- 🧹 **Household & Cleaning** - Paper Towels, Toilet Paper, Cleaning supplies, etc.
- 🧴 **Personal Care** - Shampoo, Soap, Toothpaste, Sunscreen, etc.
- 📦 **Other** - Add custom categories and items

## 🔍 How It Works

1. **Search** - Type in the search box to find products from the database
2. **Select** - Click on a product or press Enter to add it to your shopping list
3. **Custom Items** - Type a new product name and select "Add as new product" to create custom items
4. **Recent Items** - Your 10 most recently added items appear at the top for quick access
5. **Categories** - Items on your list are automatically grouped by category
6. **Toggle** - Click on any item to add/remove it from your shopping list

## ⌨️ Keyboard Shortcuts

- **Arrow Up/Down** - Navigate through search suggestions
- **Enter** - Select the highlighted or first suggestion
- **Escape** - Close search suggestions or dialogs
- **Ctrl/Cmd + Enter** - Submit dialog forms (when adding custom products)

## 🔧 Advanced Examples

# Recent Updates

## Multi-List Support (Feb 2026)

**What Changed:**
- Cards can now manage multiple independent shopping lists (groceries, hardware, pharmacy, etc.)
- Each card instance uses a unique `list_id` to keep product catalogs completely separate
- Existing single-list setups continue working unchanged (default `list_id: groceries`)

**New Configuration:**
```yaml
type: custom:shopping-list-card
title: Shopping List
list_id: groceries          # NEW: identifies which list this card manages
products_per_row: 3
layout: grid
haptics: medium
hide_completed: false
hide_section_headers: false
```

**GUI Editor:**
- Added "List ID" field in visual editor (sanitized to a-z, 0-9, underscore)
- Title field now editable in GUI
- All settings now appear in YAML preview

**Storage:**
- Default list (`groceries`) uses original storage keys for backward compatibility
- Additional lists use namespaced keys: `shopping_list_manager.{list_id}.products`
- No data migration required - existing products load automatically

**Bug Fixes:**
- Fixed GUI editor closing when selecting dropdown options (HA 2026.1 compatibility)
- Fixed settings not persisting due to frozen config objects
- Fixed passive touch event listener violations

## Technical Details

**Files Modified:**
- `websocket_api.py` - Added optional `list_id` param to all WebSocket commands
- `manager.py` - Per-list storage with lazy loading and backward-compatible groceries list
- `shopping_list_card.js` - List ID field in editor, all WebSocket calls include list_id

**Breaking Changes:** None - existing single-list setups work without any configuration changes


## 🤝 Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

When contributing:
- Follow existing code style
- Test your changes thoroughly
- Update documentation if needed
- Add comments for complex logic

## 📄 License

GPL-3.0 License - See LICENSE file for details

## 🙏 Credits

A powerful shopping list manager for Home Assistant with automatic categorization, search, and recent items tracking.

## ⭐ Support

If you find this useful, please star the repository and share it with the Home Assistant community!

---

**Made with ❤️ for the Home Assistant community**
