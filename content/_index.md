---
# Leave the homepage title empty to use the site title
title: ''
type: landing

design:
  # Default section spacing
  spacing: '3rem'

sections:
  - block: hero
    id: news
    content:
      title: 'Theoretical Physics Lab' # 📚
      subtitle: ''
      text: |-
        Welcome to the Yuhan Ma Research Lab at the Beijing Normal University. We are dedicated to advancing the field of theoretical physics through innovative research and collaboration.

        Our team is passionate about exploring new frontiers in Thermodynamics, Non-equilibrium dynamics, Physics Education.
      announcement:
        text: 🎉 Phys.org reports our latest research.
        link:
          text: Read more
          url: https://phys.org/news/2025-01-rethinking-carnot-scientists-traditional-power.html
      primary_action:
        text: Publications
        url: /publications/
        icon: sparkles
      # secondary_action:
      #   text: Read the docs
      #   url: https://example.com
    design:
      no_padding: true
  - block: collection
    id: papers
    content:
      title: Featured Publications
      count: 0
      filters:
        folders:
          - publication
        featured_only: true
    design:
      view: citation
      columns: 1
  - block: resume-biography-3
    content:
      username: yhma
      text: 'Director of lab'
      # Show a call-to-action button under your biography? (optional)
      # button:
      #   text: Download CV
      #   url: uploads/resume.pdf
    design:
      # css_class: dark
      background:
        # color: black
        image:
          # Add your image background to `assets/media/`.
          # filename: stacked-peaks.svg
          filters:
            brightness: 1.0
          size: large
          position: center
          parallax: false
  - block: community/people
    content:
      title: Meet the incredible team
      subtitle: check full list of all members in the **[People](/people/)** page
      user_groups:
        - Principal Investigator
        - Faculty Members
        - Postdoctoral Scholars
        - Graduate Students
        - Students
      sort_by: Params.last_name
      sort_ascending: true
    design:
      show_role: true
      show_social: true
      show_interests: false
  # - block: collection
  #   content:
  #     title: Recent Publications
  #     text: ''
  #     filters:
  #       folders:
  #         - publication
  #       exclude_featured: false
  #   design:
  #     view: article-grid
  # - block: collection
  #   id: news
  #   content:
  #     title: Recent News
  #     subtitle: ''
  #     text: ''
  #     # Page type to display. E.g. post, talk, publication...
  #     page_type: post
  #     # Choose how many pages you would like to display (0 = all pages)
  #     count: 5
  #     # Filter on criteria
  #     filters:
  #       author: ''
  #       category: ''
  #       tag: ''
  #       exclude_featured: false
  #       exclude_future: false
  #       exclude_past: false
  #       publication_type: ''
  #     # Choose how many pages you would like to offset by
  #     offset: 0
  #     # Page order: descending (desc) or ascending (asc) date.
  #     order: desc
  #   design:
  #     # Choose a layout view
  #     view: date-title-summary
  #     # Reduce spacing
  #     spacing:
  #       padding: [0, 0, 0, 0]
---
