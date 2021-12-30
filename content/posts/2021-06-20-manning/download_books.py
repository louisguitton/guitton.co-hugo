"""Download books for free from Manning.

Requires a user account.
"""
import os
import time
from typing import List, Dict

import requests
from bs4 import BeautifulSoup
from tqdm import tqdm
from selenium import webdriver


def vulnerability(book_id: str) -> str:
    """The found vulnerability.

    One simply needs the book_id to download the book's pdf.
    Same for kindle and epub:
    - https://www.manning.com/dashboard/download?productId=1191&downloadFormat=KINDLE
    - https://www.manning.com/dashboard/download?productId=1191&downloadFormat=EPUB
    """
    return f"https://www.manning.com/dashboard/download?productId={book_id}&downloadFormat=PDF"


def get_books_data() -> List[Dict[str, str]]:
    """List books from the Manning catalog.

    Does not require to be logged in.
    Is needed to get book_id.
    """
    res = requests.get("https://www.manning.com/catalog")
    soup = BeautifulSoup(res.content)
    books = soup.find_all("a", {"class": "catalog-link"})

    books_data = []
    for b in books:
        books_data.append(
            dict(
                book_id=b["data-id"],
                name=b["data-name"],
                slug=b["href"],
                brand=b["data-brand"],
                category=b["data-category"],
                edition=b["data-edition"],
                download_url=vulnerability(b["data-id"]),
            )
        )
    return books_data


def manning_login(driver: webdriver.Chrome, username: str, password: str):
    """Log in a selenium driver into Manning."""
    login_url = "https://login.manning.com/login?service=https%3A%2F%2Fwww.manning.com%2Flogin%2Fcas"
    driver.get(login_url)
    driver.find_element_by_id("username-sign-in").send_keys(username)
    driver.find_element_by_id("password-sign-in").send_keys(password)
    driver.find_element_by_name("submit").click()


def init_manning(
    destination_folder: str, chromedriver_path: str = "/usr/local/bin/chromedriver"
) -> webdriver.Chrome:
    """Set up a selenium Chrome driver and login to Manning.

    Reference:
        - https://chromedriver.chromium.org/getting-started
    """
    options = webdriver.ChromeOptions()
    options.add_experimental_option(
        "prefs",
        {
            "download.default_directory": destination_folder,
            "download.prompt_for_download": False,
            "download.directory_upgrade": True,
            "plugins.always_open_pdf_externally": True,
        },
    )
    driver = webdriver.Chrome(chromedriver_path, options=options)
    manning_login(driver, os.getenv("MANNING_USERNAME"), os.getenv("MANNING_PASSWORD"))
    return driver


if __name__ == "__main__":
    books_data = get_books_data()
    destination_folder = "/Users/louis.guitton/workspace/guitton.co/content/posts/2021-06-20-manning/data/"
    driver = init_manning(destination_folder)
    how_many_books_do_I_want = 10

    for book in tqdm(books_data[600:]):
        url = book["download_url"]
        driver.get(url)
        time.sleep(5)
