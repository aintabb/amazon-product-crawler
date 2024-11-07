# Amazon Crawler using Crawlee library

A simple Amazon crawler to extract product details like product name, product price, etc., using the **Crawlee** library and **Commander** library for CLI-like input/outputs.

## Features
- Amazon product crawling
- Exporting result in `.json` and `.csv` formats
- CLI like inputs\outputs

## Installation
1. Clone the repository:
  ```bash
    git clone https://github.com/amazon-product-crawler/amazon-product-crawler.git`
  ```
2. Navigate into the project directory:
  ```bash
    cd amazon-product-crawler
  ```
3. Install dependencies:
  ```bash
  npm install
  ```

## Usage
From a terminal,

1. Run the project by using the **tsx** package `npx -y tsx `~\src\app.ts crawl`
2. When the program runs, you will be prompted to enter product URLs. Either provide them in the console or add to the `~\config\config.development.json`
3. After that you will also be prompted about whether you want results to be exported as a csv file or not. If you answer as yes, the exported file will be located in `~\storage\key_value_stores`

## Example Data Format

## Product Details
```json
  {
        "title": "Tsungup PBT Keycaps - Side Printed Keycap Set,135 Keys Double Shot Shine Through Landscape Painting Custom Keycaps,Cherry Profile Keyboard Keycaps for Cherry MX Switches Mechanical Keyboards",
        "price": 36.99,
        "listPrice": 45.99,
        "reviewRating": 4.5,
        "reviewCount": 54,
        "imageUrls": [
                "https://m.media-amazon.com/images/I/41e71hYyHhL._AC_US40_.jpg",
                "https://m.media-amazon.com/images/I/41QsvA7EBQL._AC_US40_.jpg",
                "https://m.media-amazon.com/images/I/41bELGyg0KL._AC_US40_.jpg",
                "https://m.media-amazon.com/images/I/51qUi4+W1-L._AC_US40_.jpg",
                "https://m.media-amazon.com/images/I/51dPHS6vYVL._AC_US40_.jpg",
                "https://m.media-amazon.com/images/I/41s+HH2dM9L._AC_US40_.jpg",
                "https://m.media-amazon.com/images/I/51iivZ-BK-L.SS40_BG85,85,85_BR-120_PKdp-play-icon-overlay__.jpg"
        ],
        "attributes": [
                {
                        "label": "Brand",
                        "value": "Tsungup"
                },
                {
                        "label": "Compatible Devices",
                        "value": "Keyboard"
                },
                {
                        "label": "Keyboard Description",
                        "value": "Gaming"
                },
                {
                        "label": "Recommended Uses For Product",
                        "value": "Gaming"
                },
                {
                        "label": "Special Feature",
                        "value": "Backlit"
                },
                {
                        "label": "Color",
                        "value": "Landscape Painting"
                },
                {
                        "label": "Number of Keys",
                        "value": "104"
                },
                {
                        "label": "Keyboard backlighting color support",
                        "value": "RGB"
                },
                {
                        "label": "Style",
                        "value": "Modern"
                },
                {
                        "label": "Material",
                        "value": "Polybutylene Terephthalate"
                }
        ]
}
```

## License
License
This project is licensed under the MIT License - see the LICENSE file for details.