# ng-sp-peoplepicker
An Angular directive that can be used to create a Sharepoint People Picker for custom pages and custom forms.

General Usage
------------
~~~~HTML
<sp-people-picker ng-model="item.POCs" allow-multiple="true" return-limit="50" site-url="https://sharepoint.com/site">
~~~~
You can also use it as an element if you're worried about browser compatibility with browsers that don't recognize custom elements.

~~~~HTML
<sp-people-picker ng-model="item.POCs" allow-multiple="true" return-limit="50" site-url="https://sharepoint.com/site">
~~~~

The directive takes in the following

*ng-model: the angular model that the directive will be looking to for current users and returning selected users

*allow-multiple: this will set the behavior of the directive to allow or disallow the selection of multiple users

*return-limit: If you're worried about getting back too many results and slowing down the speed of your application you can reduce the number of items that the web service will return

*site-url: This is the URL that the webservice will target when searching for users. It's recommended you use the root site collection URL `http://mysite.com/sitecollection` you can also use a subsite but in some cases the user profile information on those sites may be out of date. 

The directive uses the People.asmx webservice to get directory information. The directive is configurable and can take in the URL of the site where you want to look up user information, if it should allow multiple users to be selected, the limit of users that it should return, and the ng-model that it will return the selected users to. The directive uses Bootstrap 3 and Fuel UX but can be easily swapped out if needed.
