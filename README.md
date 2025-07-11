# Hugo based Resarch Group Website

Website: https://yhmayyds.group/

## Used templates

- [HugoBlox/hugo-blox-builder](https://github.com/HugoBlox/hugo-blox-builder)
- [HugoBlox/theme-academic-cv](https://github.com/HugoBlox/theme-academic-cv): 🎓 Easily create a beautiful academic résumé or educational website using Hugo and GitHub. No code. <https://hugoblox.com/templates/>
  - We're using this theme for the website.
- [HugoBlox/theme-research-group](https://github.com/HugoBlox/theme-research-group): 👥 轻松创建研究组或组织网站 Easily create a stunning Research Group, Team, or Business Website with no-code <https://hugoblox.com/templates/>
- [adityatelange/hugo-PaperMod](https://github.com/adityatelange/hugo-PaperMod): A fast, clean, responsive Hugo theme. <https://adityatelange.github.io/hugo-PaperMod/>

## Styles inspired from

- <https://graphdeeplearning.github.io/>
- <https://www.chaitjo.com/>
- <https://lilianweng.github.io/>

## Documentation

- [Hugo Blox Docs](https://docs.hugoblox.com/)
  - [🗂️ Site structure | Hugo Blox Docs](https://docs.hugoblox.com/reference/site-structure/): Learn how to structure our website.
- [Hugo Docs](https://gohugo.io/documentation/)

## How to run or develop locally

1. Minimal setup requirements:

   - Hugo: Hugo Extended is required for the `hugo-blox-builder` to work properly.
   - Go language: Required for building the website.
   - Git: Required for version control and managing the website's source code.
   - NodeJS (Optional): for advanced customization

   Basically, if you're using Homebrew, you can install them with the following commands:

   ```sh
   brew install go hugo
   ```

   or check the official installation guide for [Hugo](https://gohugo.io/installation/) and [Go](https://go.dev/doc/install/).

2. Ensure you have `hugo` and `go` command available in your terminal.

   ```console
   $ hugo version
   hugo v0.147.9+extended+withdeploy darwin/arm64 BuildDate=2025-06-23T08:22:20Z VendorInfo=brew
   ```

   Note: The version may vary, but it should be `extended` version.

3. Start local server to edit the website:

   ```sh
   hugo server
   # or
   make serve
   ```
