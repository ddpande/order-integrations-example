const axios = require('axios');
const main_url = "https://beta.rewardplus-staging.com/"
/**save you token in secret folder */
const token = "156a48c8-eb09-4d06-81ae-d730ab7c7207";

const express = require('express');
const app = express();

app.get('/', async (req, res) => {
    res.send(await accountInfo());
});

app.get('/getProductList', async (req, res) => {
    res.send(await getProductList('', '', ''));
});
app.get('/getVoucherList', async (req, res) => {
    res.send(await getVoucherList(''));
});
app.get('/getBankList', async (req, res) => {
    res.send(await getBankList());
});
app.get('/getOrderDetail', async (req, res) => {
    res.send(await getOrderDetail(31940));
});
app.get('/getOrderList', async (req, res) => {
    res.send(await getOrderList('', '', '', ''));
});
app.get('/getDirectStatus', async (req, res) => {
    res.send(await getDirectStatus('BULK20220301-6DACLZ'));
});
app.get('/generateEvoucherLinks', async (req, res) => {
    /** add your data
  * if productCode status isDenom == true && productType == EWALLET, you have to put amount. 
  * Becouse that product doesn't have fixed price.
  * if ProductType == BANK, you have to put amount.
  */
    const data = {
        "bankCode": "bni",
        "productType": "BANK",
        "amount": 10000,
        "deliveryMethod": "FILE",
        "useInventoryService": true,
        "count": 1
    };
    res.send(await generateEvoucherLinks(data));
});
app.get('/directSending', async (req, res) => {
    /** add your data
     * if productCode status isDenom == true && productType == EWALLET, you have to put amount. 
     * Becouse that product doesn't have fixed price.
     * if ProductType == BANK, you have to put amount.
     */
    /** Example value $data_customer :
    * $data_customer = [
    *  [
    *      "customerNo" => "081212345678",
    *      "customerEmail" => "",
    *      "customerName" => "Test User",
    *      "productCode" => "OVO20H",
    *  ],
    *  [
    *      "customerNo" => "081199991111",
    *      "customerEmail" => "",
    *      "customerName" => "Test User2",
    *      "productCode" => "OVO10H",
    *  ],         * 
    * ]
    */
    const data = {
        "productCode": "SHOP25H",
        "productType": "EWALLET",
        "deliveryMethod": "BULK",
        "useInventoryService": true,
        "customers": [
            {
                "customerNo": "0811999999991111",
                "customerEmail": "",
                "customerName": "Test User"
            }
        ]
    };
    res.send(await directSending(data));
});
app.get('/createMultiDenom', async (req, res) => {
    const data = {
        "productType": "EWALLET",
        "deliveryMethod": "FILE",
        "useInventoryService": true,
        "customers": [
            {
                "customerNo": "081234567890123456",
                "customerEmail": "someuser@gmail.com",
                "customerName": "Sample User",
                "productCode": "OVO20H"
            }
        ]
    }
    res.send(await createMultiDenom(data));
});

app.listen(3000, () => {
    console.log('server start at port 3000');
});


/** Check your account info*/
async function accountInfo() {
    const headers = {
        'integrations-order': token
    };
    const api = axios.create({ headers, responseType: 'html' });

    const result = await api.get(`${main_url}order-integration/account`).then(resp => {
        return resp.data;
    })
    return result;
}

/** check product list , you can filter by exired_date, category or name*/
async function getProductList(expiry, category, name) {
    const headers = {
        'integrations-order': token
    };
    const api = axios.create({ headers, responseType: 'json' });

    const result = await api.get(`${main_url}order-integration/products?page=1&itemsPerPage=100&sortBy=createdAt&descending=true&filter[expiry]=${expiry}&filter[category]=${category}&filter[name]=${name}`)
        .then(resp => {
            return resp.data;
        });
    return result
}

/** check voucher list you also can filter by name*/
async function getVoucherList(name) {
    const headers = {
        'integrations-order': token
    };
    const api = axios.create({ headers, responseType: 'json' });

    const result = await api.get(`${main_url}order-integration/vouchers?filter[name]=${name}&page=1&itemsPerPage=10&sortBy=id&descending=true`)
        .then(resp => {
            return resp.data;
        });
    return result
}

/** check list bank exist*/
async function getBankList() {
    const headers = {
        'integrations-order': token
    };
    const api = axios.create({ headers, responseType: 'json' });

    const result = await api.get(`${main_url}order-integration/bank-list`)
        .then(resp => {
            return resp.data;
        });
    return result
}

/** check your order detail by id*/
async function getOrderDetail(order_id) {
    const headers = {
        'integrations-order': token
    };
    const api = axios.create({ headers, responseType: 'json' });

    const result = await api.get(`${main_url}order-integration/orders/${order_id}`)
        .then(resp => {
            return resp.data;
        });
    return result
}

/** check order list you can filter by bankcode, price, productCode or transId*/
async function getOrderList(bankCode, price, productCode, transId) {
    const headers = {
        'integrations-order': token
    };
    const api = axios.create({ headers, responseType: 'json' });
    const url = `${main_url}order-integration/orders?page=1&itemsPerPage=10&sortBy=createdAt&descending=false&filter[bankCode]=${bankCode}&filter[price]=${price}&filter[productCode]=${productCode}&filter[transId]=${transId}`
    const result = await api.get(url)
        .then(resp => {
            return resp.data;
        });
    return result;
}

/**check order filter by BulkId (you can get bulk Id when create Order)*/
async function getDirectStatus(bulkId) {
    const headers = {
        'integrations-order': token
    };
    const api = axios.create({ headers, responseType: 'json' });
    const result = await api.get(`${main_url}order-integration/orders?filter[bulkId]=${bulkId}`)
        .then(resp => {
            return resp.data;
        });
    return result;
}

/** create evoucher link 
 * Method FILE for generate Links
 * example ProductType = BANK
 */
/** add your data
 * if productCode status isDenom == true && productType == EWALLET, you have to put amount. 
 * Becouse that product doesn't have fixed price.
 * if ProductType == BANK, you have to put amount.
 */
async function generateEvoucherLinks(data) {
    const headers = {
        'integrations-order': token
    };

    const api = axios.create({ headers, responseType: 'json' });
    const result = await api.post(`${main_url}order-integration/bulk-order`, data)
        .then(resp => {
            return resp.data;
        });
    return result;
}

/** create order Bulk example: productType = EWALLET */
/** add your data
 * if productCode status isDenom == true && productType == EWALLET, you have to put amount. 
 * Becouse that product doesn't have fixed price.
 * if ProductType == BANK, you have to put amount.
 */
async function directSending(data) {
    const headers = {
        'integrations-order': token
    };


    const api = axios.create({ headers, responseType: 'json' });
    const result = await api.post(`${main_url}order-integration/bulk`, data)
        .then(resp => {
            return resp.data;
        });
    return result;
}


/** create order multi-denom
 * you can add 1 or more orders
 */
async function createMultiDenom(data) {
    const headers = {
        'integrations-order': token
    };

    /** Example value data :
     * $data_customer = [
     *  [
     *      "customerNo" => "081212345678",
     *      "customerEmail" => "",
     *      "customerName" => "Test User",
     *      "productCode" => "OVO20H",
     *  ],
     *  [
     *      "customerNo" => "081199991111",
     *      "customerEmail" => "",
     *      "customerName" => "Test User2",
     *      "productCode" => "OVO10H",
     *  ],         * 
     * ]
     */
    const api = axios.create({ headers, responseType: 'json' });
    const result = await api.post(`${main_url}order-integration/bulk/multi-denom`, data)
        .then(resp => {
            return resp.data;
        });
    return result;
}

async function redeemMethodFile(token, number) {
    const headers = {
        'integrations-order': token
    };
    const data =
    {
        "token": token,
        "number": number
    }
    const api = axios.create({ headers, responseType: 'json' });
    const result = await api.post(`${main_url}order-integration/redeem`, data)
        .then(resp => {
            return resp.data;
        });
    return result;
}

