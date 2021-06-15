const employee={
	personalDetails:{fullName:"",gender:"",email:"",contactNo:"",password:""},
	vehicleDetails:{make:"",model:"",vehType:"",vehNumber:"",empId:"",identification:""},
	price:""

};
var employeeArr=[];
const vehTypeArr=['Cycle','Motercycle','Four Wheeler'];

const currencyArr=['USD','YEN'];

const pricing={'Cycle':{Daily:5,Monthly:100,Yearly:500},
			   'Motercycle':{Daily:10,Monthly:200,Yearly:1000},
			'Four Wheeler':{Daily:20,Monthly:500,Yearly:3500}};

const empFields=[
		fullName={type:'text',class:"borderRadius10",id:"fullName",placeholder:"Enter Full Name",name:"fullName",maxlength:"50", textMsg:"Hi, Please Enter Your Full Name."},
		gender={type:'radio',class:"",id:"",values:['Male','Female','Other'],name:"gender",textMsg:'Hi #fullName#, Can i know your gender?'},
		email={type:'email',class:"borderRadius10",id:"email",placeholder:"Enter Email",name:"email",maxlength:"50", textMsg:'Hi #fullName#, Can i know your email?'},
		contactNo={type:'number',class:"borderRadius10",id:"contactNo",placeholder:"Enter Contact Number",name:"contactNo",maxlength:"15",textMsg:'Hi #fullName#, Can i know your contact No?'},
		password={type:'password',class:"borderRadius10",id:"password",placeholder:"Enter Password",name:"password",maxlength:"15",textMsg:'Hi #fullName#, Please enter password.',onkeyup:'passwordCheck(this);'},
		confirmPassword={type:'password',class:"borderRadius10",id:"confirmPassword",placeholder:"Confirm Password",name:"confirmPassword",maxlength:"15",textMsg:'Hi #fullName#, Please Confirm Password.',onkeyup:'passwordCheck(this);'}
	];

const vehFields=[
		make={type:'text',class:"borderRadius10",id:"make",placeholder:"Enter Vehicle Make",name:"make",maxlength:"50", textMsg:"Hi #fullName#, Please Enter Your Vehicle Make."},
		model={type:'text',class:"borderRadius10",id:"model",placeholder:"Enter Vehicle Model",name:"model",maxlength:"50", textMsg:"Hi #fullName#, Please Enter Your Vehicle Model."},
		vehType={type:'select',class:"borderRadius10",id:"vehType",values:vehTypeArr,name:"vehType",textMsg:'Hi #fullName#, Please Select Vehicle Type.'},
		vehNumber={type:'text',class:"borderRadius10",id:"vehNumber",placeholder:"Enter Vehicle Number",name:"vehNumber",maxlength:"15", textMsg:'Hi #fullName#, Please Enter Vehicle Number.'},
		empId={type:'text',class:"borderRadius10",id:"empId",placeholder:"Enter Employee ID",name:"empId",maxlength:"15",textMsg:'Hi #fullName#,Please Enter Your Employee ID'},
		identification={type:'textarea',class:"borderRadius10",id:"identification",placeholder:"Enter Any Identification of your Vehicle",name:"identification", rows:"2",cols:"20",maxlength:"2000",textMsg:'Hi #fullName#, lease Enter Any Identification of your Vehicle.'}
	];
	
const empFieldArray=['fullName','gender','email','contactNo','password','confirmPassword'];
const vehFieldArray=['make','model','vehType','vehNumber','empId','identification'];

var empCounter=0;
var vehCounter=0;
const EMAIL_REGEX = /^([a-zA-Z0-9_.+-])+\@(([a-zA-Z0-9-])+\.)+([a-zA-Z0-9]{2,4})+$/;
const NAME_REGEX = /^[a-zA-Z]+$/;
const BLANK_REGEX=/^\s*[0-9a-zA-Z][0-9a-zA-Z ]*$/
const PASSWORD_REGEX=/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)[a-zA-Z\d]{8,}$/


window.onload = function(e){
	
	$('#vehSection').hide();
	$('#pricingSection').hide();
	
	$('#empNextBtn').click(function() {
			let fullName=employee.personalDetails['fullName'];
			
			let fieldName=empFieldArray[empCounter];
			let fieldValue=$("input[name="+fieldName+"]").val();
			
			if(empFields[empCounter].type=='radio')
				fieldValue=$('input[name="'+fieldName+'"]:checked').val();
			
			if(fieldName=='fullName' || fieldName=='gender'){
				if (fieldValue==undefined || !fieldValue.match(BLANK_REGEX)) {
						 alert('Field is mandatory to proceed further.');
						 return false;
				}
			}
			
			if(fieldName=='fullName' && (!fieldValue.match(NAME_REGEX) || fieldValue.length < 2) ){
				
					alert('Only Alphabatic characters are allowed and text length should be greater than 2');
					return false;
				}
			
			if(fieldName=='email' && (!fieldValue.match(EMAIL_REGEX)) ){
					alert('Please enter a valid Email ID');
					return false;
				}
				
			if(fieldName=='contactNo' && fieldValue.length<8 ){
								alert('Contact Number should be greater than 8 digit.');
								return false;
							}
			if(fieldName=='password' && !fieldValue.match(PASSWORD_REGEX)){
				alert('Password must contains atleast one upercase, one lowercase, on number and it must be 8 char long.');
				return false;
			}
			
			if(fieldName=='confirmPassword' && fieldValue!=employee.personalDetails['password']){
				alert('Does not match with password. Please check.');
				return false;
			}
			
			if(empCounter==empFieldArray.length-1){
				
				alert('Employee Registraion ID is '+fullName+"_01");

				$('#empMsg').html('');			
				$('#empFields').html('Employee Registraion ID is '+fullName+"_01");
				$('#empNextBtn').hide();
				$('#empPrevBtn').hide();
					
				$('#empSection').hide();	
				let textMsg=vehFields[vehCounter].textMsg;
				textMsg=textMsg.replace('#fullName#',fullName);
				$('#vehMsg').html(textMsg);			
				
				$('#vehPrevBtn').hide();
				
				let fieldHtml=createFieldHtml(vehCounter,vehFields);
				$('#vehFields').html(fieldHtml);
				
				$('#vehSection').show();			
			}else{			
				employee.personalDetails[fieldName]=fieldValue;			
				empCounter++;
				if(fullName=='')
					fullName=fieldValue;
				
				let textMsg=empFields[empCounter].textMsg;
				textMsg=textMsg.replace('#fullName#',fullName);
				$('#empMsg').html(textMsg);
				
				if(empCounter!=0)
					$('#empPrevBtn').show();
				else
					$('#empPrevBtn').hide();
				
				let fieldHtml=createFieldHtml(empCounter,empFields);
				$('#empFields').html(fieldHtml);
			}
					
	});
	
	$('#vehNextBtn').click(function() {		
		if(vehCounter==vehFieldArray.length-1){
			$('#vehSection').hide();					
				$('#vehFields').html('');
				$('#vehNextBtn').hide();
				$('#vehPrevBtn').hide();				
				showPricing();
			
		}else{
			let txtValue=$("#"+vehFieldArray[vehCounter]+"").val();
			
			employee.vehicleDetails[vehFieldArray[vehCounter]]=txtValue;
			
			vehCounter++;
			let fullName=employee.personalDetails['fullName'];
			let textMsg=vehFields[vehCounter].textMsg;
			textMsg=textMsg.replace('#fullName#',fullName);
			$('#vehMsg').html(textMsg);
			
			if(vehCounter!=0)
				$('#vehPrevBtn').show();
			else
				$('#vehPrevBtn').hide();
			
			let fieldHtml=createFieldHtml(vehCounter,vehFields);
			$('#vehFields').html(fieldHtml);			
		}
			
	});
}

function passwordCheck(ele){
	var eleValue=$(ele).val();
	
	if(eleValue!='' && eleValue.length<5){
		$(ele).css("outline-color", "red");		
	}
	
	if(eleValue!='' && eleValue.length>5 && eleValue.length<10){
		$(ele).css("outline-color", "orange");		
	}
	
	if(eleValue!='' && eleValue.length>10){
		$(ele).css("outline-color", "green");		
	}
	
}
function showPricing(){
	var vehicleType=employee.vehicleDetails.vehType;
				
	var pricingHtml='<div class="pricingPanel boxShadow borderRadius10"> <center><h2 style="text-align: center;">';
	pricingHtml+=vehicleType;
	pricingHtml+='</h2> <select name="currency" id="currency" onChange="changeCurrency(this)" >'
	currencyArr.forEach(function( value ) {
			pricingHtml+='<option  value="'+value+'">'+value+'</option>';
		});
	pricingHtml+='</select><div class="priceList" id="priceDetails">';
	
	pricingHtml+='<p> <input type="radio" name="price" value="'+pricing[vehicleType].Daily+'"> <b>'+pricing[vehicleType].Daily+'</b></p>';
	pricingHtml+='<p> <input type="radio" name="price" value="'+pricing[vehicleType].Monthly+'"> <b>'+pricing[vehicleType].Monthly+'</b></p>';
	pricingHtml+='<p> <input type="radio" name="price" value="'+pricing[vehicleType].Yearly+'"> <b>'+pricing[vehicleType].Yearly+'</b></p>';
	
	pricingHtml+=' </div><button type="button" class="purchaseBtn borderRadius10" onClick="getPass();" id="getPass">Get Pass</button></center></div>';
	$('#priceForm').html(pricingHtml);
	$('#pricingSection').show();
}
function changeCurrency(ele){
	var vehicleType=employee.vehicleDetails.vehType;
	var selectedCurrency=$(ele).val();
	var pricingHtml='<p> <input type="radio" name="price" value="'+pricing[vehicleType].Daily+'"> <b> '+currencyConvertor(selectedCurrency,pricing[vehicleType].Daily)+'</b><p>';
	pricingHtml+='<p> <input type="radio" name="price" value="'+pricing[vehicleType].Monthly+'"> <b>'+currencyConvertor(selectedCurrency,pricing[vehicleType].Monthly)+'</b></p>';
	pricingHtml+='<p> <input type="radio" name="price" value="'+pricing[vehicleType].Yearly+'"> <b>'+currencyConvertor(selectedCurrency,pricing[vehicleType].Yearly)+'</b></p>';
	
	$('#priceDetails').html(pricingHtml);
	
	if(selectedCurrency=='USD')
		$('#currencyIconDiv').html('<i class="fa fa-usd sideIcon" aria-hidden="true"></i>');
	else
		$('#currencyIconDiv').html('<i class="fa fa-jpy sideIcon" aria-hidden="true"></i>');
}

function currencyConvertor(curency,price){
	if(curency=='USD')
		return price;
	
	if(curency=='YEN'){
		return Math.round(price*109.76);
	}
		
}

function getPass() {
		var price=$("input[name=price]:checked").val();
		if(price==null || price==undefined ){
			alert('Please select price from below price list');
			return false;

		}
		employee.price=	price;
		employeeArr.push(employee);		
		resetAll();
}

function resetAll(){
	empCounter=0;
	vehCounter=0;
	$('#vehSection').hide();
	$('#pricingSection').hide();
	$('#empSection').hide();	
}

function createFieldHtml(counter,fieldObj){
	var fieldHtml='';
	if(fieldObj[counter].type=='radio'){
		fieldObj[counter].values.forEach(function( value ) {
			fieldHtml+='<input type="'+fieldObj[counter].type+'" class="'+fieldObj[counter].class+'" name="'+fieldObj[counter].name+'" value="'+value+'"> <b>'+value+'</b>';
		});
		
		
	} else if(fieldObj[counter].type=='select'){
									
		fieldHtml+='<select name="'+fieldObj[counter].name+'" class="'+fieldObj[counter].class+'" id="'+fieldObj[counter].id+'">';
		
		fieldObj[counter].values.forEach(function( value ) {
			fieldHtml+='<option  value="'+value+'">'+value+'</option>';
		});
		fieldHtml+='</select>';
	} else if(fieldObj[counter].type=='textarea'){
				
		fieldHtml+='<textarea name="'+fieldObj[counter].name+'" class="'+fieldObj[counter].class+'" id="'+fieldObj[counter].id+'" rows=="'+fieldObj[counter].rows+'" cols=="'+fieldObj[counter].cols+'" maxlength="'+fieldObj[counter].maxlength+'" >';
		
		
	}else {		
		fieldHtml+='<input type="'+fieldObj[counter].type+'" ';
		fieldHtml+=' class="'+fieldObj[counter].class+'" ';	
		if(fieldObj[counter].onkeyup!=null)
		fieldHtml+=' onkeyup="'+fieldObj[counter].onkeyup+'" ';	
		
		fieldHtml+=' id="'+fieldObj[counter].id+'" placeholder="'+fieldObj[counter].placeholder+'" name="'+fieldObj[counter].name+'" maxlength="'+fieldObj[counter].maxlength+'" >';
	}
	return fieldHtml;
}