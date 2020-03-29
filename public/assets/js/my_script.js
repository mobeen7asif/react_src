 $(document).ready(function() {
 	$(".level_1").click(function(){
		$('.levels_bttn ul li a').removeClass('levelActive');
		$(".level_2_show, .level_3_show").hide();
		$(".level_1_show").show();
		$(this).addClass('levelActive');
	});
	
	$(".level_2").click(function(){
		$('.levels_bttn ul li a').removeClass('levelActive');
		$(".level_1_show, .level_3_show").hide();
		$(".level_2_show").show();
		
		$(this).addClass('levelActive');
	});
	
	$(".level_3").click(function(){
		$('.levels_bttn ul li a').removeClass('levelActive');
		$(".level_1_show, .level_2_show").hide();
		$(".level_3_show").show();
		
		$(this).addClass('levelActive');
	});

	$("#signInClick").click(function(){
		$('.tabsBttns a').removeClass('activeTab');
		$("#signUp_show").hide();
		$("#signIn_show").show();
		
		$(this).addClass('activeTab');
	});	
	
	$("#signUpClick").click(function(){
		$('.tabsBttns a').removeClass('activeTab');
		$("#signIn_show").hide();
		$("#signUp_show").show();
		$(this).addClass('activeTab');
	});

	 $(".clickAccordian").click(function() {
		 $(".segments_accordian ul li a").removeClass("active");
		 $(this).addClass("active");
		$(".clickAccordian_show").stop().slideUp(500);
		$(this).parent(".segments_accordian ul li").find(".clickAccordian_show").stop().slideDown();
	});

     /*$("body").on("click",".clickVenue",function(e){
         $("#title_of_menu").html($(this).attr("data-title"));
         $('.dropSegmentation_section , .beaconConfig_outer').hide();
         var href_id = $(this).attr("data-id");
         if(href_id =="v_VenueDetails"){
             $(".venuePortal").removeAttr("style");
             $(".venuePortal").addClass('assignLength');

         }else{

             $(".venuePortal").removeClass('assignLength');
         }
         var btn_id = $(this).attr("data-id");

         if ($(this).parents("li").find("a").hasClass("venueDtail_ancor")){
             $(".venueConfig_inner ul li ").removeClass("activeVenue");
             $("showVenue_data").show();
             $(".showVenue_data").find('div.subVenueActive').removeClass('subVenueActive');
             $(this).parents("div").addClass("subVenueActive");
             $(this).parents("li").addClass("activeVenue");
             btn_id = $(this).parents("li").find("a").attr("data-id");
             href_id = $(this).attr("data-id");
             $(".showVenue_data").css("display","block");
         }else{
             $(".showVenue_data").slideUp();
             $(".venueConfig_inner ul li ").removeClass("activeVenue");
             $(this).parent("li").addClass("activeVenue");

         }

         $('.continueCancel').hide();
         $('#'+href_id).fadeIn();
         $('#'+btn_id+'_btn').fadeIn();

         if(href_id == "auto_checkout_setting" || href_id == "app_skinning"){
             $("#auto_checkout_btn").show();
             $("#skinning_save_btn").show();
         }
         return false;
     });*/

     $(".venueDtail_ancor").click(function(e) {
         $(".showVenue_data").slideDown();
     });

     $(".venueDtail_ancor1").click(function(e) {
         $(".showVenue_data1").slideDown();
     });


     $("body").on("click",".click_level",function(e){

         var target_li = $(this).attr("data-attr").trim();
         $('.click_level').removeClass('levelActive');
         $(".popupDiv_detail_inner").hide();
         $("."+target_li).show();
         $(this).addClass('levelActive');
     });

     $("body").on("click",".overley_popup , .popupClose",function(e){
         var popup = $(this).attr("data-attr");
         $("."+popup).hide();
     });

     $("body").on("keyup","input[type='number']",function(e){
         this.value = this.value.replace(/\D/g,'');
     });


     $("body").on("click",".click_acc",function(e){
         $(".faq_questions_head").removeClass('activeBar');
         $(".faq_questions_show").stop().slideUp();

         $(this).parents(".faq_questions_head").addClass('activeBar');
         $(this).parents(".faq_questions").find(".showfaq_data").stop().slideDown();
     });

     $(document).on("input", ".numeric", function() {
         this.value = this.value.replace(/\D/g,'');
     });

     $(".insightCamp_weightInn label").click(function(e) {
         $(".insightCamp_weightOut ul li").removeClass("active");
         $(this).parents("li").addClass("active");
     });


 });


   /*  $("select").each(function(index, element) {
         var selectVal = $(this).find(":selected").val();
         $(this).parent().find("span").text(selectVal);

     });

     $("select").change(function(e) {
         var srchFiltr_val = $(this).find(":selected").val();
         $(this).parent().find("span").text(srchFiltr_val);
     });

     $(".cL_listing_table_cell").click(function(e) {
         $(".cL_listing_tableInn ul li").removeClass("active_editMod");
     });

     $(".cl_tableRow_activeInactive").click(function(e) {
         var rowActiveText = "Active" ;
         var rowInActiveText = "Inactive"
         if($(this).hasClass("active")){
             $(this).removeClass("active");
             $(this).html(rowInActiveText);
         }else{
             $(this).addClass("active");
             $(this).html(rowActiveText);
         }
     });

     $(".editPro_genderRadio").click(function(e) {
         $(".editPro_genderRadio").removeClass("checked");
         $(this).addClass("checked");
     });



     $(".header_navebar_editDots").click(function(e) {
         $(".editPro_leftBar_outer").toggleClass("openLeft_menu");
     });

     $(".container, .compaign_landing_banerOuter, .headerMenu_outer").click(function(e) {
         $(".editPro_leftBar_outer").removeClass("openLeft_menu");
     });

     $(".info_campaignRating_rangeUp a").click(function(e) {
         $(".info_campaignRating_rangeout ul li").removeClass("active");
         $(this).parents("li").addClass("active");
     });

     $(".campSchedule_vistr_capCheckbox input, .campSchedule_dayparting_Checkbox input, .insightInfo_campStatus_check input").click(function(e) {
         $(this).parent().toggleClass("checked");
     });

     $(".insightCamp_weightInn label").click(function(e) {
         $(".insightCamp_weightOut ul li").removeClass("active");
         $(this).parents("li").addClass("active");
     });

     $("body").on("click",".clickView",function(e){
         $(this).parents("li").find('.venue_showing').stop().slideToggle();
     });

     $("body").on("click",".cl_tableRow_editDotes",function(e){
         $(".memberList_showDetail").slideUp();
     });

  });*///..... end of ready() .....//

 function clearText(field){
     if(field.defaultValue == field.value){
         field.value = "";
     }else if(field.value == ""){
         field.value = field.defaultValue;
     }
 }//..... end of clearText() .....//

