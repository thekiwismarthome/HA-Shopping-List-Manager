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
todo_list: todo.shopping_list
```

### With Custom Colors

```yaml
type: custom:shopping-list-manager
todo_list: todo.shopping_list
primary_color: '#667eea'
secondary_color: '#764ba2'
recent_color: '#ffebee'
layout: grid
columns: auto
```

### List Layout

```yaml
type: custom:shopping-list-manager
todo_list: todo.shopping_list
layout: list
```

## 📋 Configuration Options

| Name | Type | Default | Description |
|------|------|---------|-------------|
| `type` | string | **Required** | `custom:shopping-list-manager` |
| `todo_list` | string | **Required** | Entity ID (e.g., `todo.shopping_list`) |
| `layout` | string | `grid` | Layout: `grid` or `list` |
| `columns` | string/integer | `auto` | Grid columns: `auto`, `3`, `4`, `5`, `6`, or `8` |
| `primary_color` | string | `#667eea` | Primary gradient color (header) |
| `secondary_color` | string | `#764ba2` | Secondary gradient color (header) |
| `recent_color` | string | `#ffebee` | Background color for recent items section |

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

### Custom Grid Layout

```yaml
type: custom:shopping-list-manager
todo_list: todo.shopping_list
layout: grid
columns: 5
primary_color: '#4a90e2'
secondary_color: '#357abd'
```

### List View with Custom Colors

```yaml
type: custom:shopping-list-manager
todo_list: todo.shopping_list
layout: list
primary_color: '#e74c3c'
secondary_color: '#c0392b'
recent_color: '#fadbd8'
```

## 🆘 Troubleshooting

### Card not showing up

1. Clear browser cache (Ctrl+Shift+R or Cmd+Shift+R)
2. Verify resource is added in Settings → Dashboards → Resources
3. Check browser console (F12) for errors
4. Restart Home Assistant

### Items not appearing

- Make sure you're using a **todo entity** (not `shopping_list` entity)
- Check that the entity ID is correct: `todo.shopping_list` or `todo.your_list_name`
- Verify the todo integration is set up in Home Assistant

### Search not working

- Type at least 2 characters to trigger search
- Check browser console for JavaScript errors
- Ensure the card has loaded completely (wait for all sections to render)

### Custom products not saving to shared file

1. **Check Browser Console** (F12 → Console tab):
   - Look for messages starting with ✅ (success) or ❌ (error)
   - If you see "Python script service not available" or "Shell command service not available", the helper is not configured
   - Check for specific error messages that will guide you to the solution

2. **Verify Setup**:
   - **Python Script Method**: Ensure `write_shopping_list.py` is in `/config/python_scripts/` and `python_script:` is in `configuration.yaml`
   - **Shell Command Method**: Ensure `shell_command` is configured in `configuration.yaml` (see `configuration_example.yaml`)
   - Restart Home Assistant after making configuration changes

3. **Check File Location**:
   - Navigate to `/config/www/community/shopping-list-manager/custom-products.json`
   - If the file doesn't exist, check Home Assistant logs for errors
   - Ensure Home Assistant has write permissions to `/config/www/`

4. **Fallback Behavior**:
   - If file storage isn't configured, products will save to browser localStorage
   - This means products are browser-specific and won't be shared
   - Check console for warnings about localStorage-only storage

## 💾 Shared Custom Products Storage

Custom products you add manually are stored in a shared file so they can be accessed by all users:

**File Location:** `/config/www/community/shopping-list-manager/custom-products.json`

### Setup for Shared File Storage

To enable shared storage (so custom products are available to all users), choose **one** of the following methods:

#### Method 1: Python Script (Recommended)

1. **Enable Python Scripts** (if not already enabled):
   Add to your `configuration.yaml`:
   ```yaml
   python_script:
   ```

2. **Copy the Helper Script**:
   - Copy `write_shopping_list.py` from this repository
   - Place it in `/config/python_scripts/write_shopping_list.py`
   - Ensure the file has executable permissions if needed

3. **Restart Home Assistant**

#### Method 2: Shell Command (Alternative)

If you prefer not to use Python scripts, add this to your `configuration.yaml`:

```yaml
shell_command:
  write_shopping_list_file: 'mkdir -p /config/www/community/shopping-list-manager && echo "$1" > /config/www/community/shopping-list-manager/custom-products.json'
```

**Note:** This method requires proper escaping. The Python script method is safer and recommended.

### Verifying Setup

1. **Check Browser Console** (F12):
   - When adding a custom product, look for: `"Custom products saved to shared file successfully"`
   - If you see warnings, the file storage is not configured

2. **Check File Location**:
   - Navigate to `/config/www/community/shopping-list-manager/custom-products.json` in your Home Assistant file system
   - The file should be created automatically when you add your first custom product

3. **Fallback Behavior**:
   - If neither method is configured, custom products will be stored in browser localStorage as a fallback
   - This means products are browser-specific and won't be shared across users
   - Check the browser console for warnings if the file isn't being created

## 📝 Prerequisites

You need a **todo entity** to use this card. You can use:

- **Local To-do** (built-in to HA) - Recommended
- **Bring!** integration
- **Todoist** integration
- Any other todo integration that supports the Home Assistant todo API

Add your integration under **Settings** → **Devices & Services** → **Add Integration**

## 🔒 Security Features

- **XSS Protection** - All user input is sanitized before rendering
- **Input Validation** - Proper escaping of HTML attributes and content
- **Memory Management** - Event listeners are properly cleaned up to prevent leaks

## 🎯 Recent Improvements

- ✅ Fixed duplicate entries in product database
- ✅ Added XSS protection for all user input
- ✅ Improved keyboard navigation and accessibility
- ✅ Enhanced error handling and user feedback
- ✅ Optimized event listener cleanup to prevent memory leaks
- ✅ Better search functionality with visual feedback

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
