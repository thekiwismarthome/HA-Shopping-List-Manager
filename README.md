# 🛒 Shopping List Manager for Home Assistant

A modern, feature-rich shopping list integration for Home Assistant with intelligent product cataloging, auto-image search, and multi-list support.

## What It Does

Shopping List Manager provides a visual, tile-based shopping list interface directly in your Home Assistant dashboard. It maintains a persistent product catalog so you never have to re-enter product details, automatically searches for product images from your local filesystem, and supports multiple independent shopping lists (groceries, hardware, pharmacy, etc.).

Unlike basic to-do lists, this integration separates product metadata (what exists) from your active shopping list (what you need), ensuring fast product additions and consistent data across shopping trips.

## Features

### 🎨 Modern UI
- **Grid or List Layout** - Switch between compact tiles or detailed list view
- **Visual Product Tiles** - Product images with emoji or URL support
- **Fuzzy Search** - Find products quickly with smart search
- **Categories** - Organize by Fruit & Veg, Fridge, Pantry, Bakery, Frozen, etc.
- **Recently Used** - Quick-add from your most recent products
- **Haptic Feedback** - Optional tactile feedback on mobile devices

### 🧠 Smart Features
- **Persistent Product Catalog** - Products remember name, category, unit, and image
- **Auto Image Search** - Automatically finds product images from `/local/images/` directory
- **Emoji Support** - Use emojis as product images (🍎🥛🍞)
- **Quantity Management** - Tap tiles to increment, long-press to edit or delete
- **Multi-List Support** - Separate lists for groceries, hardware, pharmacy, etc.
- **Live Updates** - Changes sync in real-time via WebSocket

### ⚙️ Flexible Configuration
- **Visual GUI Editor** - Configure everything through Home Assistant UI
- **Customizable Layout** - 2-6 products per row in grid mode
- **Show/Hide Options** - Toggle completed items and section headers
- **Per-Card Settings** - Each card can have unique configuration

## Installation

### Via HACS (Recommended - Coming Soon)

1. Open HACS in Home Assistant
2. Click on "Integrations"
3. Click the "+" button
4. Search for "Shopping List Manager"
5. Click "Download"
6. Restart Home Assistant

### Manual Installation via GitHub

1. **Download the integration:**
   ```bash
   cd /config/custom_components
   git clone https://github.com/yourusername/shopping-list-manager.git shopping_list_manager
   ```

   Or download and extract the [latest release](https://github.com/yourusername/shopping-list-manager/releases) to `/config/custom_components/shopping_list_manager/`

2. **Ensure folder structure looks like this:**
   ```
   /config/custom_components/shopping_list_manager/
   ├── __init__.py
   ├── manifest.json
   ├── config_flow.py
   ├── const.py
   ├── manager.py
   ├── models.py
   ├── websocket_api.py
   └── www/
       └── shopping_list_card.js
   ```

3. **Restart Home Assistant**

4. **Add the integration:**
   - Go to Settings → Devices & Services
   - Click "+ Add Integration"
   - Search for "Shopping List Manager"
   - Click to add

5. **Add the card resources:**
   - Go to Settings → Dashboards → Resources (three-dot menu, top right)
   - Click "+ Add Resource"
   - URL: `/hacsfiles/shopping_list_manager/shopping_list_card.js`
   - Resource type: JavaScript Module
   - Click "Create"

## Quick Start Guide

### Basic Configuration

Add a card to your dashboard:

```yaml
type: custom:shopping-list-card
title: Shopping List
list_id: groceries
products_per_row: 3
layout: grid
haptics: medium
hide_completed: false
hide_section_headers: false
```

### Configuration Options

| Option | Type | Default | Description |
|--------|------|---------|-------------|
| `type` | string | **Required** | Must be `custom:shopping-list-card` |
| `title` | string | `Shopping List` | Card title |
| `list_id` | string | `groceries` | Unique identifier for this list |
| `products_per_row` | number | `3` | Tiles per row (2-6) in grid mode |
| `layout` | string | `grid` | `grid` or `list` |
| `haptics` | string | `medium` | `light`, `medium`, `heavy`, or `none` |
| `hide_completed` | boolean | `false` | Hide items with quantity 0 |
| `hide_section_headers` | boolean | `false` | Hide category headers |

### Supported Categories

The integration includes these predefined categories:

- 🥬 **Fruit & Veg** (`fruitveg`)
- 🥛 **Fridge** (`fridge`)
- 🥫 **Pantry** (`pantry`)
- 🍞 **Bakery** (`bakery`)
- 🧊 **Frozen** (`frozen`)
- 🧴 **Household** (`household`)
- 🐕 **Pets** (`pets`)
- 👶 **Baby** (`baby`)
- 🛒 **Other** (`other`)

### Multiple Lists

Create separate lists for different purposes:

```yaml
# Groceries card
type: custom:shopping-list-card
title: Groceries
list_id: groceries
products_per_row: 3

# Hardware store card  
type: custom:shopping-list-card
title: Hardware
list_id: hardware
products_per_row: 4

# Pharmacy card
type: custom:shopping-list-card
title: Pharmacy
list_id: pharmacy
products_per_row: 3
```

Each `list_id` maintains completely separate products and quantities.

### Auto Image Search

Place product images in `/config/www/images/` (accessible as `/local/images/` in HA):

```
/config/www/images/
├── apple.png
├── milk.jpg
├── bread.png
└── ...
```

When you search for "apple", the integration automatically finds and uses `apple.png`. Images are matched using fuzzy search, so `Granny_Smith_Apple.jpg` will match "granny smith".

**Supported formats:** `.png`, `.jpg`, `.jpeg`, `.gif`, `.webp`, `.svg`

## How It Works

### Architecture

**Two-Layer Data Model:**
1. **Product Catalog** - Persistent store of all products you've ever added (name, category, unit, image)
2. **Active List** - Temporary quantities for your current shopping trip

This separation means:
- ✅ Add products once, use forever
- ✅ Product details stay consistent
- ✅ Fast quantity adjustments (just tap)
- ✅ Shopping history preserved

### Data Storage

- **Backend:** `/config/.storage/shopping_list_manager.{list_id}.products`
- **Backend:** `/config/.storage/shopping_list_manager.{list_id}.active_list`
- **Frontend:** Card settings stored in dashboard YAML

Default list (`groceries`) uses backward-compatible flat keys for existing installations.

### WebSocket Communication

The card communicates with Home Assistant via WebSocket API:
- `shopping_list_manager/get_products` - Fetch product catalog
- `shopping_list_manager/get_active` - Fetch active quantities
- `shopping_list_manager/add_product` - Add/update product
- `shopping_list_manager/set_qty` - Update quantity
- `shopping_list_manager/delete_product` - Remove product

Changes sync instantly across all open browsers/apps via 3-second polling.

## Troubleshooting

**Products disappeared after update:**
- Check `/config/.storage/shopping_list_manager.products` exists
- Clear browser cache (Ctrl+Shift+R or Cmd+Shift+R)
- Delete `/config/custom_components/shopping_list_manager/__pycache__` and restart HA

**Images not loading:**
- Verify images are in `/config/www/images/`
- Check browser console (F12) for 404 errors
- Ensure filenames match product names (fuzzy match supported)

**Card editor closes when selecting options:**
- Update to latest version (fixed in v1.0.1+)
- Hard refresh browser (Ctrl+F5)

**"Invalid config" error:**
- Ensure all required fields present
- Check YAML indentation
- Validate `list_id` contains only letters, numbers, underscores

## Contributing

Contributions welcome! Please:
1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Submit a pull request

## License

MIT License - see [LICENSE](LICENSE) file for details

## Credits

Created for the Home Assistant community. Special thanks to all contributors and testers.

## Support

- 🐛 [Report bugs](https://github.com/yourusername/shopping-list-manager/issues)
- 💡 [Request features](https://github.com/yourusername/shopping-list-manager/issues)
- 💬 [Community forum](https://community.home-assistant.io/)

---

**Note:** Replace `yourusername` with your actual GitHub username in all URLs.

## 🙏 Credits

A powerful shopping list manager for Home Assistant with automatic categorization, search, and recent items tracking.

## ⭐ Support

If you find this useful, please star the repository and share it with the Home Assistant community!

---

**Made with ❤️ for the Home Assistant community**
