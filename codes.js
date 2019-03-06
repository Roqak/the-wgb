
//AJAX POST

formData = {data1:"yourdata1", data2:1021};
$.ajax({
    type: "POST",
    url: "http://localhost/teleinformatica/API/user/validarLogin",
    data: formData,
    success: function(data){console.log(data);},
   dataType: "json",
   contentType : "application/json"
});