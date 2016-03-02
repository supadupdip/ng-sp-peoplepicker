# ng-sp-peoplepicker
An Angular directive that can be used to create a Sharepoint People Picker for custom pages and custom forms.

General Usage
------------
~~~~HTML
<sp-people-picker ng-model="item.POCs" allow-multiple="true" return-limit="50" site-url="https://sharepoint.com/site" allow-typeahead="true">
~~~~
You can also use it as an element if you're worried about browser compatibility with browsers that don't recognize custom elements.

~~~~HTML
<sp-people-picker ng-model="item.POCs" allow-multiple="true" return-limit="50" site-url="https://sharepoint.com/site" allow-typeahead="true">
~~~~

The directive takes in the following

* **ng-model**: the angular model that the directive will be looking to for current users and returning selected users

* **allow-multiple**: this will set the behavior of the directive to allow or disallow the selection of multiple users

* **return-limit**: If you're worried about getting back too many results and slowing down the speed of your application you can reduce the number of items that the web service will return

* **site-url**: This is the URL that the webservice will target when searching for users. It's recommended you use the root site collection URL `http://mysite.com/sitecollection` you can also use a subsite but in some cases the user profile information on those sites may be out of date.

Returned User Object format
------------------
~~~JS
[
  {
    accountName: '',
    userInfoID = ''
    displayName = '',
    info.email = '',
    info.department = '',
    info.isResolved = '',
    info.principalType = ''
  }
]
~~~

When a user is selected in the picker it will push the object above to the ng-model you indicated. The picker itself only needs the displayName if what you're passing into it on load is a smaller object from a getListItem operation.

The picker will always expect an array of user objects even if the directive is set to only allow one user.

If you're using something like SPServices to get your data you would set the return type as UserMulti and it would return an array of user objects.

~~~JS
var myJson = $(xData.responseXML).SPFilterNode("z:row").SPXmlToJson({
   mapping: {
     ows_ID: {mappedName: "ID", objectType: "Counter"},
     ows_Title: {mappedName: "Title", objectType: "Text"},
     ows_Sales_x0020_Rep: {mappedName: "SalesRep", objectType: "UserMulti"}
    },   // name, mappedName, objectType
   includeAllAttrs: true
  });
~~~

Data Source
-----------------
The directive uses the People.asmx webservice to get directory information. The directive is configurable and can take in the URL of the site where you want to look up user information. it will take the url you provide in the **site-url** attribute and append `/_vti_bin/People.asmx` to make an `$http` call. The directive will fail gracefully if your URL does not resolve and give you the output of the error result. If there are no matches found it will also show a `No Results` message.

Type-ahead option
-----------------
The `allow-typeahead` option let's you turn on the ability for users to start typing a user name, display name, email address and start a quick search with suggested users. The option limits the return to only 5 object to provide faster results. It also uses a ng-model-options debounce setting to start the search a half second after the last keyup.

Requires
------------------
The directive was built with Angular 1.4.3, Bootstrap 3.3.6, and Fuel UX 3.13.0
