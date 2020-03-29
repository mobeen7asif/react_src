
<script>
            @if(isset($soldi_order_id) && $soldi_order_id != 0)
    var obj = "{ \"status\": \"true\",\"message\":\"Payment Success\",\"soldi_order_id\":\"<?php echo $soldi_order_id??0; ?>\"}";
            @elseif (isset($cardData))
    var obj = "{ \"status\": \"false\",\"message\":\"Error occured while adding card\"}";
                    @elseif(isset($soldi_order_id) && $soldi_order_id == 0)
            var obj = "{\"status\": \"false\",\"message\":\"Payment Failed\"}";
            @else
    var obj = "{\"status\": \"true\",\"message\":\"Successfully added\"}";
    @endif
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
<p align="center">Loading...</p>