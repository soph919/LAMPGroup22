const urlBase = '/LAMPAPI';
const extension = 'php';

let userId = 0;
let firstName = "";
let lastName = "";

function showRegister()
{
	document.getElementById("loginDiv").style.display = "none";
	document.getElementById("registerDiv").style.display = "block";
}

function showLogin()
{
	document.getElementById("registerDiv").style.display = "none";
	document.getElementById("loginDiv").style.display = "block";
}

function doRegister()
{
	let first = document.getElementById("regFirstName").value;
	let last = document.getElementById("regLastName").value;
	let login = document.getElementById("regUsername").value;
	let password = document.getElementById("regPassword").value;

	document.getElementById("registerResult").innerHTML = "";

	let tmp = {firstName:first,lastName:last,login:login,password:password};
	let jsonPayload = JSON.stringify(tmp);

	let url = urlBase + '/Register.' + extension;

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

function saveCookie()
{
	let minutes = 20;
	let date = new Date();
	date.setTime(date.getTime()+(minutes*60*1000));
	document.cookie = "firstName=" + firstName + ",lastName=" + lastName + ",userId=" + userId + ";expires=" + date.toGMTString();
}

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

function doLogout()
{
	userId = 0;
	firstName = "";
	lastName = "";
	document.cookie = "firstName= ; expires = Thu, 01 Jan 1970 00:00:00 GMT";
	window.location.href = "index.html";
}

function addContact()
{
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

function searchContact()
{
	let srch = document.getElementById("searchText").value;
	document.getElementById("contactSearchResult").innerHTML = "";

	let tmp = {search:srch,userId:userId};
	let jsonPayload = JSON.stringify( tmp );

	let url = urlBase + '/SearchContact.' + extension;

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

				let contactListHtml = "";

				if (jsonObject.results && jsonObject.results.length > 0)
				{
					for (let i = 0; i < jsonObject.results.length; i++)
					{
						let c = jsonObject.results[i];
						contactListHtml += c.FirstName + " " + c.LastName;
						if (c.Phone) contactListHtml += " | " + c.Phone;
						if (c.Email) contactListHtml += " | " + c.Email;
						contactListHtml += " <button onclick='openEdit(" + c.ID + ",\"" + c.FirstName + "\",\"" + c.LastName + "\",\"" + c.Phone + "\",\"" + c.Email + "\")'>Edit</button>";
						contactListHtml += " <button onclick='deleteContact(" + c.ID + ")'>Delete</button>";
						contactListHtml += "<br />";
					}
				}
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
		document.getElementById("contactSearchResult").innerHTML = err.message;
	}
}

function deleteContact(id)
{
	let tmp = {id:id};
	let jsonPayload = JSON.stringify(tmp);

	let url = urlBase + '/DeleteContact.' + extension;

	let xhr = new XMLHttpRequest();
	xhr.open("POST", url, true);
	xhr.setRequestHeader("Content-type", "application/json; charset=UTF-8");
	try
	{
		xhr.onreadystatechange = function()
		{
			if (this.readyState == 4 && this.status == 200)
			{
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

function openEdit(id, fn, ln, ph, em)
{
	document.getElementById("editDiv").style.display = "block";
	document.getElementById("editId").value = id;
	document.getElementById("editFirstName").value = fn;
	document.getElementById("editLastName").value = ln;
	document.getElementById("editPhone").value = ph;
	document.getElementById("editEmail").value = em;
}

function updateContact()
{
	let id = document.getElementById("editId").value;
	let fn = document.getElementById("editFirstName").value;
	let ln = document.getElementById("editLastName").value;
	let ph = document.getElementById("editPhone").value;
	let em = document.getElementById("editEmail").value;

	let tmp = {id:parseInt(id),firstName:fn,lastName:ln,phone:ph,email:em};
	let jsonPayload = JSON.stringify(tmp);

	let url = urlBase + '/UpdateContact.' + extension;

	let xhr = new XMLHttpRequest();
	xhr.open("POST", url, true);
	xhr.setRequestHeader("Content-type", "application/json; charset=UTF-8");
	try
	{
		xhr.onreadystatechange = function()
		{
			if (this.readyState == 4 && this.status == 200)
			{
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

function cancelEdit()
{
	document.getElementById("editDiv").style.display = "none";
}
