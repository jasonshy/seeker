# seeker.github.io
Work in progress, haven't finished.

The grocery store where I work doesn't have enough scanners for every employee to check where an item belongs. Even if I manage to get one, it doesn't support searching for items using text, which is unhelpful since customers typically know the item's name, brand, or type rather than its UPC.

This project is about building a website that everyone can visit to search for items by name or brand at FreshCo (Whitehorn) and find out their aisle, rack, and level.
Only the creator and admins can add entities to the database (on Azure).
The event handler will be an Azure function app.
Information such as the brand and name of an item will be retrieved from the Open Food Facts API.
