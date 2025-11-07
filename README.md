# ngx-theme-toggle

<a href="https://ngxui.com" target="_blank" style="display: flex;gap: .5rem;align-items: center;cursor: pointer; padding: 0 0 0 0; height: fit-content;">
  <img src="https://ngxui.com/assets/img/ngxui-logo.png" style="width: 64px;height: 64px;">
</a>

This library is part of the **NGXUI ecosystem**.<br>
View all available components at [ngxui.com](https://ngxui.com)

`@omnedia/ngx-theme-toggle` provides a smooth, animated theme switcher for Angular applications. It supports
multiple animation styles and automatically syncs theme state using CSS classes or custom attributes.

## Features

* Animated light/dark theme toggle with multiple transition styles
* Supports both class-based and attribute-based theme control
* Works with SSR (uses platform checks)
* Customizable animation duration and style
* Accepts custom light/dark icons and labels via content projection
* Uses Angular Signals for efficient reactivity

## Installation

```bash
npm install @omnedia/ngx-theme-toggle
```

## Usage

Import the component in your standalone component or Angular module:

```typescript
import { NgxThemeToggleComponent } from '@omnedia/ngx-theme-toggle';

@Component({
  ...,
  imports: [NgxThemeToggleComponent],
  standalone: true,
})
export class AppComponent {
}
```

Then add it to your template:

```html

<om-theme-toggle
  [animationStyle]="'circle'"
  [duration]="400"
  [showText]="true"
></om-theme-toggle>
```

### Custom Icons and Label

You can provide your own icons and label using attributes. <br>
For that, you need to import the directives `OmDarkIcon`, `OmLightIcon` and `OmLabel`

```html

<om-theme-toggle>
  <svg darkIcon xmlns="http://www.w3.org/2000/svg" width="24" height="24" ...>
    <!-- Dark theme icon -->
  </svg>
  <svg lightIcon xmlns="http://www.w3.org/2000/svg" width="24" height="24" ...>
    <!-- Light theme icon -->
  </svg>
  <p toggleLabel>Toggle Theme</p>
</om-theme-toggle>
```

### Required Global CSS

Add the following to your global stylesheet (e.g., `styles.scss`):

```scss
::view-transition-old(root),
::view-transition-new(root) {
  animation: none;
  mix-blend-mode: normal;
}
```

## API

| Input             | Type                    | Default     | Description                                                     |
|-------------------|-------------------------|-------------|-----------------------------------------------------------------|
| `duration`        | `number`                | `400`       | Duration of the transition animation (ms)                       |
| `themeTarget`     | `string`                | `'html'`    | Element selector or target (`html`, `body`, or custom selector) |
| `themeAttribute`  | `string?`               | `undefined` | Use an attribute instead of CSS class to determine the theme    |
| `lightThemeClass` | `string`                | `'light'`   | CSS class or attribute value for light mode                     |
| `darkThemeClass`  | `string`                | `'dark'`    | CSS class or attribute value for dark mode                      |
| `animationStyle`  | `OmThemeAnimationStyle` | `circle`    | Type of animation used during transitions                       |
| `showText`        | `boolean`               | `false`     | Whether to show a label next to the icon                        |

## Example

```html

<om-theme-toggle
  [animationStyle]="'wipe'"
  [duration]="500"
  [showText]="true"
  [themeTarget]="'body'"
></om-theme-toggle>
```

With custom icons and label:

```html

<om-theme-toggle [animationStyle]="'fade'">
  <svg darkIcon ...>...</svg>
  <svg lightIcon ...>...</svg>
  <span toggleLabel>Switch Theme</span>
</om-theme-toggle>
```

## How It Works

The component watches for theme changes on the target element (`html`, `body`, or a custom selector) and uses the **View
Transitions API** for smooth animations when supported by the browser. If the API is unavailable, it gracefully falls
back to instant switching.

Theme state is stored in `localStorage` under the key `theme`, ensuring persistence across reloads.

## Styling

You can freely style the toggle button and its icons using standard CSS:

```scss
.om-theme-toggle {
  cursor: pointer;
  border: none;
  background: none;
  display: flex;
  align-items: center;
  gap: 0.5rem;
}
```

## Contributing

Contributions are welcome! Feel free to open issues or submit pull requests on GitHub.

## License

This project is licensed under the **MIT License**.
