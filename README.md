# Stoop Side Scribbles

A personal blog built with Hugo and deployed on Cloudflare Pages.

## Local Development

### Prerequisites

1. Install Hugo (Extended version recommended):
   ```bash
   # macOS
   brew install hugo
   
   # Or download from https://gohugo.io/installation/
   ```

### Running Locally

1. Clone the repository
2. Run the development server:
   ```bash
   hugo server -D
   ```
3. Open http://localhost:1313 in your browser

### Building for Production

```bash
hugo --minify
```

The built site will be in the `public/` directory.

## Deployment

This site is configured for deployment on Cloudflare Pages:

1. Connect your GitHub repository to Cloudflare Pages
2. Set the build command to: `hugo --minify`
3. Set the publish directory to: `public`
4. Set the Hugo version to: `0.121.0`

## Project Structure

```
├── content/          # Blog posts and pages
│   ├── posts/        # Blog posts
│   └── about.md      # About page
├── layouts/          # HTML templates
│   ├── _default/     # Default templates
│   └── index.html    # Home page template
├── static/           # Static assets
│   └── css/          # Stylesheets
├── config.toml       # Hugo configuration
└── wrangler.toml     # Cloudflare Pages config
```

## Adding New Posts

1. Create a new markdown file in `content/posts/`
2. Add front matter with metadata:
   ```yaml
   ---
   title: "Your Post Title"
   date: 2024-01-01T12:00:00Z
   draft: false
   author: "Ellie Goetz"
   description: "Brief description of the post"
   tags: ["tag1", "tag2"]
   ---
   ```
3. Write your content in markdown

## Customization

- Edit `config.toml` to change site settings
- Modify `static/css/main.css` to customize styling
- Update templates in `layouts/` to change the site structure

## License

This project is licensed under the MIT License. 