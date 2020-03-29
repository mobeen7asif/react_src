var percent_factor_big = 83;
var percent_factor_small = 81;
function pd_members_turnover_chart_host(wr_prcnt1,txt)
{
        wr_prcnt = parseInt(wr_prcnt1);
        if(wr_prcnt >100){ wr_prcnt = 100;}
        if(wr_prcnt < -100 ){ wr_prcnt = -100;}
       
       if(wr_prcnt == 1){ new_prcnt_turnover = 1;}
       else if(wr_prcnt == -1){ new_prcnt_turnover = -1;}
       else{ new_prcnt_turnover = Math.ceil(parseInt((percent_factor_big * wr_prcnt)/100));}
        
        minus_color = 'rgb(224,50,51)';
        plus_color = 'rgb(77, 119, 176)';
        
        $e = $('#members_turnover_chart');
        
        if(new_prcnt_turnover > 0)
        {
         
           interval1 = 1;
        var member_turnover_interval = setInterval(function(){
            if(interval1 == new_prcnt_turnover) clearInterval(member_turnover_interval);
          
           $('#members_turnover_chart').find('.custom-right').css({
                "background-image": "-webkit-linear-gradient(top, rgb(7, 119, 176), rgba(7, 119, 176,0.5) "+interval1+"%, transparent "+interval1+"%, transparent 100%)",
           });
          $('#members_turnover_chart').find('.custom-right').css({
                "background-image": "-moz-linear-gradient(top, rgb(7, 119, 176), rgba(7, 119, 176,0.5) "+interval1+"%, transparent "+interval1+"%, transparent 100%)",
           });
           $('#members_turnover_chart').find('.custom-right').css({
                "background-image": "-o-linear-gradient(top, rgb(7, 119, 176), rgba(7, 119, 176,0.5) "+interval1+"%, transparent "+interval1+"%, transparent 100%)",
           });
           $('#members_turnover_chart').find('.custom-right').css({
                "background-image": "linear-gradient(top, rgb(7, 119, 176), rgba(7, 119, 176,0.5) "+interval1+"%, transparent "+interval1+"%, transparent 100%)",
           });
           
            interval1++;
        }, 5);
        
           $e.find('.wr-p-container').css('color',plus_color);
           $e.find('.percent-text.symbol').text('+');
           $e.find('.percent-text.symbol').addClass('plus_icon');
        }
        if(new_prcnt_turnover < 0)
        {
            new_prcnt_turnover = Math.abs(new_prcnt_turnover);
            wr_prcnt = Math.abs(wr_prcnt);
            $custom_left = $e.find('.custom-left');
           
            interval2 = 1;
            var member_turnover_interval2 = setInterval(function () {
            if (interval2 == new_prcnt_turnover)
                clearInterval(member_turnover_interval2);

                $('#members_turnover_chart').find('.custom-left').css({
                    "background-image": "-webkit-linear-gradient(top, rgb(224,50,51), rgba(224,50,51,0.5) " + interval2 + "%, transparent " + interval2 + "%, transparent 100%)",
                });
                $('#members_turnover_chart').find('.custom-left').css({
                    "background-image": "-moz-linear-gradient(top, rgb(224,50,51), rgba(224,50,51,0.5) " + interval2 + "%, transparent " + interval2 + "%, transparent 100%)",
                });
                $('#members_turnover_chart').find('.custom-left').css({
                    "background-image": "-o-linear-gradient(top, rgb(224,50,51), rgba(224,50,51,0.5) " + interval2 + "%, transparent " + interval2 + "%, transparent 100%)",
                });
                $('#members_turnover_chart').find('.custom-left').css({
                    "background-image": "linear-gradient(top, rgb(224,50,51), rgba(224,50,51,0.5) " + interval2 + "%, transparent " + interval2 + "%, transparent 100%)",
                });

            interval2++;
        }, 5);
           
           $e.find('.wr-p-container').css('color',minus_color);
           $e.find('.percent-text.symbol').text('-');
           $e.find('.percent-text.symbol').addClass('minus_icon');
        }
        
        $e.find('.percent-num').prop('Counter',0).animate({
        Counter: wr_prcnt
        }, {
            duration: 1500,
            easing: 'swing',
            step: function (now) {
                $(this).text(Math.ceil(now));
            }
        });
       
       $e.find('.wr-chart-circle').children('p').text(txt);
    
}

function pd_members_visitation_host(wr_prcnt_visitation1,txt)
{
    wr_prcnt_visitation = parseInt(wr_prcnt_visitation1)
        if(wr_prcnt_visitation >100){ wr_prcnt_visitation = 100;}
        if(wr_prcnt_visitation < -100 ){ wr_prcnt_visitation = -100;}
       
       
       if(wr_prcnt_visitation == 1){ new_prcnt_visitation = 1;}
       else if(wr_prcnt_visitation == -1){ new_prcnt_visitation = -1;}
       else{new_prcnt_visitation = parseInt((percent_factor_big * wr_prcnt_visitation)/100);}
        minus_color = 'rgb(224,50,51)';
        plus_color = 'rgb(7, 119, 176)'
        
        $ele = $('#members_visitation');
        
        if(new_prcnt_visitation > 0)
        {
           
           interval3 = 1;
        var members_visitation_interval = setInterval(function(){
            if(interval3 == new_prcnt_visitation) clearInterval(members_visitation_interval);
                $('#members_visitation').find('.custom-right').css({
                    "background-image": "-webkit-linear-gradient(top, rgb(7, 119, 176), rgba(7, 119, 176,0.5) " + interval3 + "%, transparent " + interval3 + "%, transparent 100%)",
                });
                $('#members_visitation').find('.custom-right').css({
                    "background-image": "-moz-linear-gradient(top, rgb(7, 119, 176), rgba(7, 119, 176,0.5) " + interval3 + "%, transparent " + interval3 + "%, transparent 100%)"
                });
                $('#members_visitation').find('.custom-right').css({
                    "background-image": "-0-linear-gradient(top, rgb(7, 119, 176), rgba(7, 119, 176,0.5) " + interval3 + "%, transparent " + interval3 + "%, transparent 100%)"
                });

                $('#members_visitation').find('.custom-right').css({
                    "background-image": "linear-gradient(top, rgb(7, 119, 176), rgba(7, 119, 176,0.5) " + interval3 + "%, transparent " + interval3 + "%, transparent 100%)",
                }); 
            interval3++;
        }, 5);
        
           $ele.find('.wr-p-container').css('color',plus_color);
           $ele.find('.percent-text.symbol').text('+');
           $ele.find('.percent-text.symbol').addClass('plus_icon');

        }
        if(new_prcnt_visitation < 0)
        {
            new_prcnt_visitation = Math.abs(new_prcnt_visitation);
            wr_prcnt_visitation = Math.abs(wr_prcnt_visitation);
            
           
           interval_4 = 1;
            var member_turnover_interval = setInterval(function () {
            if (interval_4 == new_prcnt_visitation)
                clearInterval(member_turnover_interval);

                $('#members_visitation').find('.custom-left').css({
                    "background-image": "-webkit-linear-gradient(top, rgb(224,50,51), rgba(224,50,51,0.5)" + interval_4 + "%, transparent " + interval_4 + "%, transparent 100%)",
                });
               $('#members_visitation').find('.custom-left').css({
                    "background-image": "-moz-linear-gradient(top, rgb(224,50,51), rgba(224,50,51,0.5) " + interval_4 + "%, transparent " + interval_4 + "%, transparent 100%)",
                });
                $('#members_visitation').find('.custom-left').css({
                    "background-image": "-o-linear-gradient(top, rgb(224,50,51), rgba(224,50,51,0.5) " + interval_4 + "%, transparent " + interval_4 + "%, transparent 100%)",
                });
                $('#members_visitation').find('.custom-left').css({
                    "background-image": "linear-gradient(top, rgb(224,50,51), rgba(224,50,51,0.5) " + interval_4 + "%, transparent " + interval_4 + "%, transparent 100%)",
                });

            interval_4++;
        }, 5);
           
           $ele.find('.wr-p-container').css('color',minus_color);
           $ele.find('.percent-text.symbol').text('-');
           $ele.find('.percent-text.symbol').addClass('minus_icon');
        }
        
        $ele.find('.percent-num').prop('Counter',0).animate({
        Counter: wr_prcnt_visitation
        }, {
            duration: 1500,
            easing: 'swing',
            step: function (now) {
                $(this).text(Math.ceil(now));
            }
        });
        
        
      // e.find('.percent-num').text(wr_prcnt_visitation);
       $ele.find('.wr-chart-circle').children('p').text(txt);
    
}

function pd_pointme_user_dwell_host(wr_prcnt_pointme1,txt)
{
    wr_prcnt_pointme = parseInt(wr_prcnt_pointme1);
        if(wr_prcnt_pointme >100){ wr_prcnt_pointme = 100;}
        if(wr_prcnt_pointme < -100 ){ wr_prcnt_pointme = -100;}
       
       if(wr_prcnt_pointme == 1){ new_prcnt_pointme = 1;}
       else if(wr_prcnt_pointme == -1){ new_prcnt_pointme = -1;}
       else{new_prcnt_pointme = parseInt((percent_factor_big * wr_prcnt_pointme)/100);}
  
        minus_color = 'rgb(224,50,51)';
        plus_color = 'rgb(7, 119, 176)';
        
        $el = $('#pointme_users_dwell');
        
        if(new_prcnt_pointme > 0)
        {
           
           interval5 = 1;
        var pointme_interval = setInterval(function(){
            if(interval5 == new_prcnt_pointme) clearInterval(pointme_interval);
                $('#pointme_users_dwell').find('.custom-right').css({
                    "background-image": "-webkit-linear-gradient(top, rgb(7, 119, 176), rgba(7, 119, 176,0.5) " + interval5 + "%, transparent " + interval5 + "%, transparent 100%)"
                });
                $('#pointme_users_dwell').find('.custom-right').css({
                    "background-image": "-moz-linear-gradient(top, rgb(7, 119, 176), rgba(7, 119, 176,0.5) " + interval5 + "%, transparent " + interval5 + "%, transparent 100%)"
                });
               $('#pointme_users_dwell').find('.custom-right').css({
                    "background-image": "-o-linear-gradient(top, rgb(7, 119, 176), rgba(7, 119, 176,0.5) " + interval5 + "%, transparent " + interval5 + "%, transparent 100%)"
                });
               $('#pointme_users_dwell').find('.custom-right').css({
                    "background-image": "linear-gradient(top, rgb(7, 119, 176), rgba(7, 119, 176,0.5) " + interval5 + "%, transparent " + interval5 + "%, transparent 100%)"
                });
            interval5++;
        }, 5);
        
           $el.find('.wr-p-container').css('color',plus_color);
           $el.find('.percent-text.symbol').text('+');
           $el.find('.percent-text.symbol').addClass('plus_icon');
        }
        if(new_prcnt_pointme < 0)
        {
            new_prcnt_pointme = Math.abs(new_prcnt_pointme);
            wr_prcnt_pointme = Math.abs(wr_prcnt_pointme);
            $custom_left3 = $el.find('.custom-left');
           
         interval_6 = 1;
        var pointme_interval_2 = setInterval(function(){
            if(interval_6 == new_prcnt_pointme) clearInterval(pointme_interval_2);
                $('#pointme_users_dwell').find('.custom-left').css({
                    "background-image": "-webkit-linear-gradient(top, rgb(224,50,51), rgba(224,50,51,0.5) " + interval_6 + "%, transparent " + interval_6 + "%, transparent 100%)",
                });

               $('#pointme_users_dwell').find('.custom-left').css({
                    "background-image": "-moz-linear-gradient(top, rgb(224,50,51), rgba(224,50,51,0.5) " + interval_6 + "%, transparent " + interval_6 + "%, transparent 100%)"
                });

                $('#pointme_users_dwell').find('.custom-left').css({
                    "background-image": "-o-linear-gradient(top, rgb(224,50,51), rgba(224,50,51,0.5) " + interval_6 + "%, transparent " + interval_6 + "%, transparent 100%)"
                });

                $('#pointme_users_dwell').find('.custom-left').css({
                    "background-image": "-moz-linear-gradient(top, rgb(224,50,51), rgba(224,50,51,0.5) " + interval_6 + "%, transparent " + interval_6 + "%, transparent 100%)"
                });
            interval_6++;
        }, 5);
           
           
           
           $el.find('.wr-p-container').css('color',minus_color);
           $el.find('.percent-text.symbol').text('-');
           $el.find('.percent-text.symbol').addClass('minus_icon');
        }
        
        $el.find('.percent-num').prop('Counter',0).animate({
        Counter: wr_prcnt_pointme
        }, {
            duration: 1500,
            easing: 'swing',
            step: function (now) {
                $(this).text(Math.ceil(now));
            }
        });
        
        
      // e.find('.percent-num').text(wr_prcnt_pointme);
       $el.find('.wr-chart-circle').children('p').text(txt);
    
}