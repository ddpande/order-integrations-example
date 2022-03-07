<!DOCTYPE html>
<html lang="en">

<head>
    <meta charset="UTF-8">
    <meta http-equiv="X-UA-Compatible" content="IE=edge">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Document</title>
</head>

<body>
    <?php

    $GLOBALS['main_url'] = "https://beta.rewardplus-staging.com/";
    /**save you token in secret folder */
    $GLOBALS['token'] = "156a48c8-eb09-4d06-81ae-d730ab7c7207";

    /** CURL GET */
    function get_http_request($url)
    {
        $ch = curl_init();

        /**set url  */
        curl_setopt($ch, CURLOPT_URL, $GLOBALS['main_url'] . $url);

        /** return the transfer as a string */
        curl_setopt($ch, CURLOPT_RETURNTRANSFER, 1);
        curl_setopt($ch, CURLINFO_HEADER_OUT, true);
        /** $output contains the output string */
        curl_setopt(
            $ch,
            CURLOPT_HTTPHEADER,
            array(
                'Content-Type: application/json',
                'integrations-order: ' . $GLOBALS['token'],
            )
        );
        $output = curl_exec($ch);

        /**close curl  */
        curl_close($ch);

        /**menampilkan hasil curl */
        return $output;
    }

    /** CURL POST */
    function post_http_request($url, $data)
    {
        $ch = curl_init();

        $payload = json_encode($data);
        /** set url */
        curl_setopt($ch, CURLOPT_URL, $GLOBALS['main_url'] . $url);
        /** return the transfer as a string */
        curl_setopt($ch, CURLOPT_POSTFIELDS, $payload);
        curl_setopt($ch, CURLOPT_RETURNTRANSFER, true);

        /**Set HTTP Header for POST request */
        curl_setopt(
            $ch,
            CURLOPT_HTTPHEADER,
            array(
                'Content-Type: application/json',
                'integrations-order: ' . $GLOBALS['token'],
            )
        );
        /** $output contains the output string */
        $output = curl_exec($ch);

        /** close curl */
        curl_close($ch);

        /** show result curl */
        return $output;
    }

    /** Check your account info*/
    function AccountInfo()
    {
        $response = get_http_request('order-integration/account');
        echo $response;
    }

    /** check product list , you can filter by exired_date, category or name*/
    function getProductList($expiry, $category, $name)
    {
        $url = "order-integration/products?page=1&itemsPerPage=10&sortBy=createdAt&descending=true&filter[expiry]=$expiry&filter[category]=$category&filter[name]=$name";
        $response = get_http_request($url);
        echo $response;
    }

    /** check voucher list you also can filter by name*/
    function getVoucherList($name)
    {
        $url = "order-integration/vouchers?filter[name]=$name&itemsPerPage=10&sortBy=id&descending=true";
        $response = get_http_request($url);
        echo $response;
    }

    /** check list bank exist*/
    function getBankList()
    {
        $url = "order-integration/bank-list";
        $response = get_http_request($url);

        echo $response;
    }

    /** check your order detail by id*/
    function getOrderDetail($id_order)
    {
        $url = "order-integration/orders/$id_order";
        $response = get_http_request($url);
        echo $response;
    }

    /** check order list you can filter by bankcode, price, productCode or transId*/
    function getOrderList($bankCode, $price, $productCode, $transId)
    {
        $url = "order-integration/orders?page=1&itemsPerPage=1&sortBy=createdAt&descending=false&filter[bankCode]=$bankCode&filter[price]=$price&filter[productCode]=$productCode&filter[transId]=$transId";
        $response = get_http_request($url);
        echo $response;
    }


    /**check order filter by BulkId (you can get bulk Id when create Order)*/
    function getOrderbyBulkId($bulkId)
    {
        $url = "order-integration/orders?filter[bulkId]=$bulkId";
        $response = get_http_request($url);
        echo $response;
    }

    /** create evoucher link 
     * Method FILE for generate Links
     * example ProductType = BANK
     */
    function createEvoucherLink($productCode, $productType, $amount, $count)
    {
        $url = "order-integration/bulk-order";
        /** add your data
         * if productCode status isDenom == true && productType == EWALLET, you have to put amount. 
         * Becouse that product doesn't have fixed price.
         * if ProductType == BANK, you have to put amount.
         */
        $data = [
            "productCode" => $productCode,
            "productType" => $productType,
            "amount" => $amount,
            "deliveryMethod" => "FILE",
            "useInventoryService" => "true",
            "count" => $count
        ];

        $response = post_http_request($url, $data);
        echo $response;
    }

    /** create order Bulk example: productType = EWALLET */
    function createDirectSending($productCode, $productType, $amount, $count)
    {
        $url = "order-integration/bulk-order";
        /** add your data
         * if productCode status isDenom == true && productType == EWALLET, you have to put amount. 
         * Becouse that product doesn't have fixed price.
         * if ProductType == BANK, you have to put amount.
         */
        $data = [
            "productCode" => $productCode,
            "productType" => $productType,
            // "amount" => $amount,
            "deliveryMethod" => "BULK",
            "useInventoryService" => "true",
            "customers" => [
                [
                    "customerNo" => "0811999999991111",
                    "customerEmail" => "",
                    "customerName" => "Test User"
                ]
            ]
        ];

        $response = post_http_request($url, $data);
        echo $response;
    }

    /** create order multi-denom
     * you can add 1 or more orders
     */
    function createMultiDenom($data_customer, $productType, $deliveryMethod)
    {
        $url = "order-integration/bulk/multi-denom";

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
        $data = [
            "productType" => $productType,
            "deliveryMethod" => $deliveryMethod,
            "useInventoryService" => "true",
            "customers" => $data_customer
        ];
        $response = post_http_request($url, $data);
        echo $response;
    }
    function redeemMethodFile($token, $number)
    {
        $url = "order-integration/redeem";


        $data = [
            "token" => $token,
            "number" => $number,
        ];
        $response = post_http_request($url, $data);
        echo $response;
    }

    ?>



</body>

</html>