# HA-Shopping-List-Manager
# 🛒 Shopping List Card with Categories

A powerful Home Assistant Lovelace card that transforms your shopping experience with automatic category grouping, collapsible sections, and a beautiful interface inspired by the Bring! app.

[![hacs_badge](https://img.shields.io/badge/HACS-Custom-orange.svg)](https://github.com/custom-components/hacs)
[![GitHub Release](https://img.shields.io/github/release/YOUR-USERNAME/shopping-list-card-grouped.svg)](https://github.com/YOUR-USERNAME/shopping-list-card-grouped/releases)

## ✨ Features

### 🎯 Two Card Types

**1. Individual Shopping List Card**
- Quick add/remove items from your todo list
- Quantity controls with +/- buttons
- Custom icons and colors
- Image support for visual appeal
- Horizontal and vertical layouts

**2. Category Group Card (NEW!)**
- **Auto-groups items by category** (Bring! app style)
- **Collapsible category sections** with emojis
- **Item counters** for each category
- **Responsive grid layout**
- Perfect for organized shopping

### 🎨 Customization

- Custom icons (Material Design Icons built-in)
- Custom colors (names or hex codes)
- Product images support
- Quantity tracking
- Theme-aware design

## 📦 Installation

### HACS (Recommended)

1. Open HACS in Home Assistant
2. Click on **Frontend**
3. Click the **⋮** menu (top right) → **Custom repositories**
4. Add repository URL: `https://github.com/YOUR-USERNAME/shopping-list-card-grouped`
5. Category: **Lovelace**
6. Click **Add**
7. Find "Shopping List Card with Categories" and click **Download**
8. Restart Home Assistant

### Manual Installation

1. Download `shopping-list-card-grouped.js` from the latest release
2. Copy it to `/config/www/shopping-list-card-grouped.js`
3. Add the resource in Home Assistant:
   - Go to **Settings** → **Dashboards** → **Resources** (⋮ menu)
   - Click **+ Add Resource**
   - URL: `/local/shopping-list-card-grouped.js`
   - Resource type: **JavaScript Module**
4. Clear browser cache and restart Home Assistant

## 🚀 Quick Start

### Individual Cards

```yaml
type: custom:shopping-list-card
title: Milk
todo_list: todo.shopping_list
category: "Fridge, Delivery & Eggs"
off_icon: mdi:cup
enable_quantity: true
layout: vertical
```

### Auto-Grouped Category Card

```yaml
type: custom:shopping-list-category-group
todo_list: todo.shopping_list
items:
  # Fruit & Vegetables
  - title: Apples
    category: "Fruit & Vegetables"
    off_icon: mdi:food-apple
    enable_quantity: true
  - title: Bananas
    category: "Fruit & Vegetables"
    off_icon: mdi:fruit-banana
    enable_quantity: true
    
  # Fridge, Delivery & Eggs
  - title: Milk
    category: "Fridge, Delivery & Eggs"
    off_icon: mdi:cup
    enable_quantity: true
  - title: Eggs
    category: "Fridge, Delivery & Eggs"
    off_icon: mdi:egg
    enable_quantity: true
    
  # Bread & Bakery
  - title: Bread
    category: "Bread & Bakery"
    off_icon: mdi:baguette
    enable_quantity: true
```

## 📋 Configuration Options

### Individual Card Options

| Name | Type | Default | Description |
|------|------|---------|-------------|
| `type` | string | **Required** | `custom:shopping-list-card` |
| `title` | string | **Required** | Item name |
| `todo_list` | string | **Required** | Entity ID (e.g., `todo.shopping_list`) |
| `category` | string | Optional | Category name for organization |
| `subtitle` | string | Optional | Secondary text |
| `image` | string | Optional | URL to product image |
| `layout` | string | `horizontal` | Layout: `horizontal` or `vertical` |
| `enable_quantity` | boolean | `false` | Show quantity controls |
| `on_icon` | string | `mdi:check` | Icon when item is on list |
| `off_icon` | string | `mdi:plus` | Icon when item is off list |
| `on_color` | string | `green` | Color when on list |
| `off_color` | string | `grey` | Color when off list |
| `colorize_background` | boolean | `true` | Tint background when on |

### Category Group Options

| Name | Type | Default | Description |
|------|------|---------|-------------|
| `type` | string | **Required** | `custom:shopping-list-category-group` |
| `todo_list` | string | **Required** | Entity ID |
| `items` | array | **Required** | Array of item configurations |
| `category_order` | array | Optional | Custom category sort order |

## 🎨 Supported Categories

The card includes emoji icons for these categories:

- 🥬 Fruit & Vegetables
- 🥛 Fridge, Delivery & Eggs
- 🥖 Bread & Bakery
- 🥩 Meat & Fish
- 🍝 Pasta, Rice & Canned Food
- 🧊 Frozen
- 🍫 Sweets & Snacks
- 🥤 Drinks
- 👶 Baby & Kids
- 🐾 Pet Food
- 🧹 Household & Cleaning
- 🧴 Personal Care
- 📦 Other (custom categories)

## 🔧 Advanced Examples

### With Custom Images

```yaml
type: custom:shopping-list-card
title: Organic Milk
todo_list: todo.shopping_list
category: "Fridge, Delivery & Eggs"
image: /local/shopping/milk.png
enable_quantity: true
```

### Horizontal Layout with Custom Colors

```yaml
type: custom:shopping-list-card
title: Premium Coffee
todo_list: todo.shopping_list
category: "Drinks"
layout: horizontal
off_icon: mdi:coffee
on_color: brown
off_color: grey
enable_quantity: true
```

### Complete Shopping Dashboard

```yaml
views:
  - title: Shopping
    path: shopping
    cards:
      - type: custom:shopping-list-category-group
        todo_list: todo.shopping_list
        items:
          - title: Apples
            category: "Fruit & Vegetables"
            off_icon: mdi:food-apple
            enable_quantity: true
          - title: Milk
            category: "Fridge, Delivery & Eggs"
            off_icon: mdi:cup
            enable_quantity: true
          - title: Bread
            category: "Bread & Bakery"
            off_icon: mdi:baguette
            enable_quantity: true
          # Add more items...
```

## 🛠️ Import Tool

Check out the included **Import Tool** (see `import-tool.html`) for:
- Pre-configured grocery database with 100+ items
- Auto-icon assignment
- Bulk YAML generation
- Custom item import

## 🆘 Troubleshooting

### Card not showing up
1. Clear browser cache (Ctrl+Shift+R)
2. Verify resource is added in Settings → Dashboards → Resources
3. Check browser console (F12) for errors
4. Restart Home Assistant

### Icons not displaying
- Make sure you're using valid MDI icons
- Check https://pictogrammers.com/library/mdi/ for icon names
- Icon names must start with `mdi:`

### Quantity not working
- Enable `enable_quantity: true` in your config
- Make sure you're using a todo entity (not shopping_list entity)

## 📝 Prerequisites

You need a **todo entity** to use this card. You can use:

- **Local To-do** (built-in to HA)
- **Bring!** integration
- **Todoist** integration
- Any other todo integration

Add your integration under **Settings → Devices & Services → Add Integration**

## 🤝 Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

## 📄 License

MIT License - feel free to use and modify!

## 🙏 Credits

Based on the original [Shopping List Card](https://github.com/eyalgal/ha-shopping-list-card) by eyalgal, enhanced with category grouping and additional features.

## ⭐ Support

If you find this useful, please star the repository!

---

**Made with ❤️ for the Home Assistant community**
