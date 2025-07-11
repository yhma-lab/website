---
# An instance of the Contact widget.
widget: contact

# This file represents a page section.
headless: true

# Order that this section appears on the page.
weight: 130

title: Contact
subtitle:

content:
  # Automatically link email and phone or display as text?
  autolink: true

  # Email form provider
  form:
    provider: netlify
    formspree:
      id:
    netlify:
      # Enable CAPTCHA challenge to reduce spam?
      captcha: false

  # Contact details (edit or remove options as required)
  email: yhma@gscaep.ac.cn
  phone: "+86-188 8888 8888"
  address:
    street: 海淀区西北旺东路 10 号院
    city: 北京
    region: 北京
    postcode: "100193"
    country: 中国
    country_code: CN
  coordinates:
    latitude: "37.4275"
    longitude: "-122.1697"
  directions: 东区 8 号楼 A429
  office_hours:
    - "Monday 10:00 to Friday 18:00"
  appointment_url: "https://calendly.com"
  contact_links:
    - icon: twitter
      icon_pack: fab
      name: DM Me
      link: "https://twitter.com/Twitter"
    - icon: video
      icon_pack: fas
      name: Zoom Me
      link: "https://zoom.com"

design:
  columns: "2"
---
