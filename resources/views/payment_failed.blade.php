
<script>

    var obj = "{ \"status\": \"false\",\"message\":\"Payment Failed\",\"soldi_order_id\":\"\"}";

    //Http RFequest for checking response




    // if iPhone
    var is_uiwebview = /(iPhone|iPod|iPad).*AppleWebKit(?!.*Safari)/i.test(navigator.userAgent);
    if (is_uiwebview) {
        window.webkit.messageHandlers.MobileEvent.postMessage(obj);
    } else {




        // For Android
        if(window.MobileEvent)
            window.MobileEvent.textFromWeb(obj);
    }

</script>
<p  style="font-size: 16px;text-align: center">Failed...</p>