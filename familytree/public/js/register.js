
$("form#register").submit(function(e) {
    e.preventDefault();    
    var formData = new FormData(this);

    $.ajax({
        url:"/check-details",
        method:"POST",
        data:formData,
        success:function(res){
            if(res == "y"){
                document.getElementById("1_c").style.display ="block"
                document.getElementById("1_cr").style.display ="none"

            }
            else{
                document.getElementById("1_cr").style.display ="block"
                document.getElementById("1_c").style.display ="none"


            }
        },
        cache: false,
        contentType: false,
        processData: false
    })

    $.ajax({
        url:"/check-father",
        method:"POST",
        data:formData,
        success:function(res){
            if(res == "y"){
                document.getElementById("f_c").style.display ="block"
                document.getElementById("f_cr").style.display ="none"

            }
            else{
                document.getElementById("f_cr").style.display ="block"
                document.getElementById("f_c").style.display ="none"


            }
        },
        cache: false,
        contentType: false,
        processData: false
    })

    $.ajax({
        url:"/check-mother",
        method:"POST",
        data:formData,
        success:function(res){
            if(res == "y"){
                document.getElementById("m_c").style.display ="block"
                document.getElementById("m_cr").style.display ="none"

            }
            else{
                document.getElementById("m_cr").style.display ="block"
                document.getElementById("m_c").style.display ="none"
            }
            if(document.getElementById("1_c").style.display == "block" && document.getElementById("f_c").style.display == "block" && document.getElementById("m_c").style.display == "block"){
    document.getElementById("proceed").style.display = "block"
    document.getElementById("birth").style.display ="block"
    document.getElementById("verif").style.display ="none"
}
        },
        cache: false,
        contentType: false,
        processData: false
    })

})

$("#proceed").on("click",()=>{
    $("form#register").submit(function(e) {
    e.preventDefault();    
    var formData = new FormData(this);
    $.ajax({
        url:"/register-details",
        method:"POST",
        data:formData,
       success:function(res){
        if(res == "added"){
            window.location.href="/successful"
        }
       },
        cache: false,
        contentType: false,
        processData: false
    })
    })
})
