const urlBase = '/LAMPAPI';
const extension = 'php';

let userId = 0;
let firstName = "";
let lastName = "";

//new
//hides login form and shows registration form
function showRegister()
{
	document.getElementById("loginDiv").style.display = "none";
	document.getElementById("registerDiv").style.display = "block";
}

//new
//hides register and shows login form
function showLogin()
{
	document.getElementById("registerDiv").style.display = "none";
	document.getElementById("loginDiv").style.display = "block";
}


//new
//user creation
function doRegister()
{
	//grabs fn,ln,user, and password and sends post to register.php as json
	let first = document.getElementById("regFirstName").value;
	let last = document.getElementById("regLastName").value;
	let login = document.getElementById("regUsername").value;
	let password = document.getElementById("regPassword").value;

	document.getElementById("registerResult").innerHTML = "";

	let tmp = {firstName:first,lastName:last,login:login,password:password};
	let jsonPayload = JSON.stringify(tmp);

	//sends to php
	let url = urlBase + '/Register.' + extension;

	//same xhr pattern as do login
	let xhr = new XMLHttpRequest();
	xhr.open("POST", url, true);
	xhr.setRequestHeader("Content-type", "application/json; charset=UTF-8");
	try
	{
		xhr.onreadystatechange = function()
		{
			if (this.readyState == 4 && this.status == 200)
			{
				let jsonObject = JSON.parse(xhr.responseText);
				if (jsonObject.error != "")
				{
					document.getElementById("registerResult").innerHTML = jsonObject.error;
				}
				else
				{
					document.getElementById("registerResult").innerHTML = "Account created! You can now log in.";
					setTimeout(showLogin, 1500);
				}
			}
		};
		xhr.send(jsonPayload);
	}
	catch(err)
	{
		document.getElementById("registerResult").innerHTML = err.message;
	}
}

//same- 1 alteration
function doLogin()
{
	userId = 0;
	firstName = "";
	lastName = "";

	let login = document.getElementById("loginName").value;
	let password = document.getElementById("loginPassword").value;
//	var hash = md5( password );

	document.getElementById("loginResult").innerHTML = "";

	let tmp = {login:login,password:password};
//	var tmp = {login:login,password:hash};
	let jsonPayload = JSON.stringify( tmp );

	let url = urlBase + '/Login.' + extension;

	let xhr = new XMLHttpRequest();
	xhr.open("POST", url, true);
	xhr.setRequestHeader("Content-type", "application/json; charset=UTF-8");
	try
	{
		xhr.onreadystatechange = function()
		{
			if (this.readyState == 4 && this.status == 200)
			{
				let jsonObject = JSON.parse( xhr.responseText );
				userId = jsonObject.id;

				if( userId < 1 )
				{
					document.getElementById("loginResult").innerHTML = "User/Password combination incorrect";
					return;
				}

				firstName = jsonObject.firstName;
				lastName = jsonObject.lastName;

				saveCookie();
				//changes to contact.html
				window.location.href = "contact.html";
			}
		};
		xhr.send(jsonPayload);
	}
	catch(err)
	{
		document.getElementById("loginResult").innerHTML = err.message;
	}

}

//same
function saveCookie()
{
	let minutes = 20;
	let date = new Date();
	date.setTime(date.getTime()+(minutes*60*1000));
	document.cookie = "firstName=" + firstName + ",lastName=" + lastName + ",userId=" + userId + ";expires=" + date.toGMTString();
}

//same
function readCookie()
{
	userId = -1;
	let data = document.cookie;
	let splits = data.split(",");
	for(var i = 0; i < splits.length; i++)
	{
		let thisOne = splits[i].trim();
		let tokens = thisOne.split("=");
		if( tokens[0] == "firstName" )
		{
			firstName = tokens[1];
		}
		else if( tokens[0] == "lastName" )
		{
			lastName = tokens[1];
		}
		else if( tokens[0] == "userId" )
		{
			userId = parseInt( tokens[1].trim() );
		}
	}

	if( userId < 0 )
	{
		window.location.href = "index.html";
	}
	else
	{
//		document.getElementById("userName").innerHTML = "Logged in as " + firstName + " " + lastName;
	}
}

//same
function doLogout()
{
	userId = 0;
	firstName = "";
	lastName = "";
	document.cookie = "firstName= ; expires = Thu, 01 Jan 1970 00:00:00 GMT";
	window.location.href = "index.html";
}


//nows addContact instead of addColor
function addContact()
{
	//4 fields now
	let fn = document.getElementById("contactFirstName").value;
	let ln = document.getElementById("contactLastName").value;
	let ph = document.getElementById("contactPhone").value;
	let em = document.getElementById("contactEmail").value;
	document.getElementById("contactAddResult").innerHTML = "";

	let tmp = {firstName:fn,lastName:ln,phone:ph,email:em,userId:userId};
	let jsonPayload = JSON.stringify( tmp );

	let url = urlBase + '/AddContact.' + extension;

	let xhr = new XMLHttpRequest();
	xhr.open("POST", url, true);
	xhr.setRequestHeader("Content-type", "application/json; charset=UTF-8");
	try
	{
		xhr.onreadystatechange = function()
		{
			if (this.readyState == 4 && this.status == 200)
			{
				document.getElementById("contactAddResult").innerHTML = "Contact has been added";
				document.getElementById("contactFirstName").value = "";
				document.getElementById("contactLastName").value = "";
				document.getElementById("contactPhone").value = "";
				document.getElementById("contactEmail").value = "";
				//call search contact so refreshes
				searchContact();
			}
		};
		xhr.send(jsonPayload);
	}
	catch(err)
	{
		document.getElementById("contactAddResult").innerHTML = err.message;
	}

}

//searchColor replaced with searchContact
function searchContact()
{
	//grab input and clear other
	let srch = document.getElementById("searchText").value;
	document.getElementById("contactSearchResult").innerHTML = "";

	let tmp = {search:srch,userId:userId};
	let jsonPayload = JSON.stringify( tmp );

	//send to searchcontact.php
	let url = urlBase + '/SearchContact.' + extension;

	//send post
	let xhr = new XMLHttpRequest();
	xhr.open("POST", url, true);
	xhr.setRequestHeader("Content-type", "application/json; charset=UTF-8");
	try
	{
		xhr.onreadystatechange = function()
		{
			if (this.readyState == 4 && this.status == 200)
			{
				let jsonObject = JSON.parse( xhr.responseText );

				if (jsonObject.error != "" && jsonObject.error != "No Records Found")
				{
					document.getElementById("contactSearchResult").innerHTML = jsonObject.error;
					return;
				}

				//build contact list
				let contactListHtml = "";

				if (jsonObject.results && jsonObject.results.length > 0)
				{
					for (let i = 0; i < jsonObject.results.length; i++)
					{
						//display contacts with edit and delete buttons instead of plain text
						let c = jsonObject.results[i];
						contactListHtml += c.FirstName + " " + c.LastName;
						if (c.Phone) contactListHtml += " | " + c.Phone;
						if (c.Email) contactListHtml += " | " + c.Email;
						contactListHtml += " <button onclick='openEdit(" + c.ID + ",\"" + c.FirstName + "\",\"" + c.LastName + "\",\"" + c.Phone + "\",\"" + c.Email + "\")'>Edit</button>";
						contactListHtml += " <button onclick='deleteContact(" + c.ID + ")'>Delete</button>";
						contactListHtml += "<br />";
					}
				}
				//no results
				else
				{
					contactListHtml = "No contacts found";
				}

				document.getElementById("contactList").innerHTML = contactListHtml;
			}
		};
		xhr.send(jsonPayload);
	}
	catch(err)
	{
		//display it 
		document.getElementById("contactSearchResult").innerHTML = err.message;
	}
}

//new
//function to delete contact
function deleteContact(id)
{
	let tmp = {id:id};
	let jsonPayload = JSON.stringify(tmp);

	//sends id to php
	let url = urlBase + '/DeleteContact.' + extension;

	//same xhr logic
	let xhr = new XMLHttpRequest();
	xhr.open("POST", url, true);
	xhr.setRequestHeader("Content-type", "application/json; charset=UTF-8");
	try
	{
		xhr.onreadystatechange = function()
		{
			if (this.readyState == 4 && this.status == 200)
			{
				//successs call search contcat to refresh
				searchContact();
			}
		};
		xhr.send(jsonPayload);
	}
	catch(err)
	{
		alert(err.message);
	}
}

//function to edit a contact
function openEdit(id, fn, ln, ph, em)
{
	//makes hidden edit div visible
	document.getElementById("editDiv").style.display = "block";
	//udates fields
	document.getElementById("editId").value = id;
	document.getElementById("editFirstName").value = fn;
	document.getElementById("editLastName").value = ln;
	document.getElementById("editPhone").value = ph;
	document.getElementById("editEmail").value = em;
}

//func to update contact
function updateContact()
{
	//grabs values from edit form
	let id = document.getElementById("editId").value;
	let fn = document.getElementById("editFirstName").value;
	let ln = document.getElementById("editLastName").value;
	let ph = document.getElementById("editPhone").value;
	let em = document.getElementById("editEmail").value;

	let tmp = {id:parseInt(id),firstName:fn,lastName:ln,phone:ph,email:em};
	let jsonPayload = JSON.stringify(tmp);

	//send to php
	let url = urlBase + '/UpdateContact.' + extension;

	//same kxr logic
	let xhr = new XMLHttpRequest();
	xhr.open("POST", url, true);
	xhr.setRequestHeader("Content-type", "application/json; charset=UTF-8");
	try
	{
		xhr.onreadystatechange = function()
		{
			if (this.readyState == 4 && this.status == 200)
			{
				//success hide edit form and refresh with search
				document.getElementById("editDiv").style.display = "none";
				searchContact();
			}
		};
		xhr.send(jsonPayload);
	}
	catch(err)
	{
		document.getElementById("editResult").innerHTML = err.message;
	}
}

//func to cancel editing contact
function cancelEdit()
{
	//hides edit div
	document.getElementById("editDiv").style.display = "none";
}

