/*//Boilerplate Single-SPA Logic
let decisionApproval_Simple_htmlLifecycles = window.inRuleServices.embeddedApplicationService.singleSpaHtml({
  template: getTemplate(),
  domElementGetter:  () => document.getElementById('inrule-ea-container')
});*/

decisionApproval_Simple_htmlLifecycles.originalMount = decisionApproval_Simple_htmlLifecycles.mount;
decisionApproval_Simple_htmlLifecycles.mount = function (props) {
  return decisionApproval_Simple_htmlLifecycles.originalMount(props)
    .then(() => {
      window.inRuleServices.eventService.activeApplicationChanged("Decision Approval");
      initialize();
    });
}.bind(decisionApproval_Simple_htmlLifecycles);


// Example URL Paramters: ?catalog=DefaultCatalog&ruleApp=InvoiceSample&labelRevision=2&applyLabel=NEWLIVE&promoteLabel=LIVE&promoteToCatalog=ThirdCatalog&promoteComment=My%20Comment
// Example URL: http://localhost:9000/trial-agbx1f-824/DecisionApproval?catalog=DefaultCatalog&ruleApp=InvoiceSample&labelRevision=2&applyLabel=LIVE


// Application Logic

// Configuration - this will eventually need to be configured to a Function within an appropriate Data Sovergnty region for the Tenant
let apiUrl = "https://road-dgardiner-dev-functionsv2.azurewebsites.net/api/CatalogServiceWebHelper";
let addNewLabelText = "Add New...";
let defaultSelection = "Select...";

// These are retrieved from Portal services
let userJwt = false;
let userEmail = false;
let catalogs = false;

// These are populated with initial values parsed from URL parameters
let initialCatalogName;
let initialRuleAppName;
let initialLabelRevision;
let initialApplyLabel;

// Startup Logic
function initialize() {
  // Load initial values from URL parameters
  const params = new Proxy(new URLSearchParams(window.location.search), {
    get: (searchParams, prop) => searchParams.get(prop),
  });
  initialCatalogName = params.catalog;
  initialRuleAppName = params.ruleApp;
  initialLabelRevision = params.labelRevision;
  initialApplyLabel = params.applyLabel;

  // Load data required for page to be able to load
  // Note: Because these each return an Observable, callbacks get hit multiple times, hence the diff logic in the callback
  if(!loadPageIfReady()) {
    window.inRuleServices.authenticationService.getUserEmail().subscribe((email) => {
      if(userEmail != email) {
        userEmail = email;
        loadPageIfReady();
      }
    });
    window.inRuleServices.authenticationService.getAccessToken().subscribe((jwt) => {
      if(userJwt != jwt) {
        userJwt = jwt;
        loadPageIfReady();
      }
    });
    var currentTenant = window.inRuleServices.navigationService.getCurrentTenantAlias();
    window.inRuleServices.tenantManagementService.getTenantResources(currentTenant).subscribe((resources) => {
      catalogs = resources.filter(r => r.type == "Catalog")
      loadPageIfReady();
    });
  }
}
function loadPageIfReady() {
  if(userJwt && userEmail && catalogs) {
    loadCatalogs();
    return true;
  }
  return false;
}

// Startup Helpers
function loadCatalogs() {
  var catalogDropdown = document.getElementById("catalog");
  catalogDropdown.addEventListener('change', (event) => {
    document.getElementById("newLabel").value = "";

    loadRuleApps(catalogDropdown.value);
    loadLabels(catalogDropdown.value);
  });

  populateDropdown("catalog", catalogs, text => text.name, value => value.uri, initialCatalogName);
  initialCatalogName = null;
  catalogDropdown.dispatchEvent(new Event("change"));
}
function loadRuleApps(catalogUri) {
  var requestObj = {
    UserEmailAddress: userEmail,
    UserJWT: userJwt,
    CatalogURI: catalogUri,
    RequestType: "GetRuleAppInfo"
  };
  postData(apiUrl, requestObj)
    .then(ruleApps => {
      var ruleAppDropdown = document.getElementById("ruleAppName");
      ruleAppDropdown.addEventListener('change', (event) => {
        var selectedRuleApp = ruleApps.find(r => r.name == ruleAppDropdown.value);
        loadRevisions(catalogUri, selectedRuleApp);
        document.getElementById("ruleAppInfo").textContent = JSON.stringify(selectedRuleApp, null, 4);
      });

      var previousValue = document.getElementById("ruleAppName").value;
      populateDropdown("ruleAppName", ruleApps, text => text.name, value => value.name, initialRuleAppName);
      initialRuleAppName = null;
      if(previousValue)
        document.getElementById("ruleAppName").value = previousValue;
      ruleAppDropdown.dispatchEvent(new Event("change"));
    });
}
function loadLabels(catalogUri) {
  var requestObj = {
    UserEmailAddress: userEmail,
    UserJWT: userJwt,
    CatalogURI: catalogUri,
    RequestType: "GetLabels"
  };
  postData(apiUrl, requestObj)
    .then(labels => {
      var applyLabelDropdown = document.getElementById("applyLabel_label");
      applyLabelDropdown.addEventListener('change', (event) => {
        if(applyLabelDropdown.value == addNewLabelText) {
          document.getElementById("newLabel").disabled = false;
        }
        else {
          document.getElementById("newLabel").disabled = true;
        }
      });
      populateDropdown("applyLabel_label", labels.concat([addNewLabelText]), text => text, value => value, initialApplyLabel);
      if(initialApplyLabel && document.getElementById("applyLabel_label").value != initialApplyLabel) {
        document.getElementById("applyLabel_label").value = addNewLabelText;
        document.getElementById("newLabel").value = initialApplyLabel;
      }
      initialApplyLabel = null;
      applyLabelDropdown.dispatchEvent(new Event("change"));
    });
}
function loadRevisions(catalogUri, ruleAppInfo) {
  populateDropdown("applyLabel_revision", ruleAppInfo.revisions, text => text.revision, value => value.revision, initialLabelRevision);
  initialLabelRevision = null
}
function populateDropdown(selectIdentifier, data, textMap, valueMap, initialSelectedValue) {
  var dropdown = document.getElementById(selectIdentifier);
  dropdown.innerHTML = "";
  data.forEach(element => {
    let option = document.createElement("option");
    option.text = textMap(element);
    option.value = valueMap(element);
    dropdown.add(option);
  });
  var itemToSelect = data.find(e => textMap(e) == initialSelectedValue);
  if(initialSelectedValue && itemToSelect)
    dropdown.value = valueMap(itemToSelect);
}

// Action Logic
function applyLabel() {
  let catalogUri = document.getElementById("catalog").value;
  let ruleAppName = document.getElementById("ruleAppName").value;
  let revision = document.getElementById("applyLabel_revision").value;
  let labelToApply = document.getElementById("applyLabel_label").value;
  if(labelToApply == addNewLabelText) {
    labelToApply = document.getElementById("newLabel").value;
  }

  var requestObj = {
    UserEmailAddress: userEmail,
    UserJWT: userJwt,
    CatalogURI: catalogUri,
    RequestType: "ApplyLabel",
    RuleAppName: ruleAppName,
    RevisionToLabel: revision,
    LabelToApply: labelToApply
  };

  console.log(requestObj);
  postData(apiUrl, requestObj)
    .then(data => {
      console.log(data);
      //document.getElementById("result").innerHTML = data;
      document.getElementById("catalog").dispatchEvent(new Event("change")); // Triggers a re-retrieval of RuleApp information from the Catalog
      if(data == "Success")
        window.inRuleServices.notificationService.alertExternal("Applied Successfully", "Label " + labelToApply + " has been applied to revision " + revision + ".", "success");
      else
        window.inRuleServices.notificationService.alertExternal("Error Applying Label", "Label was not successfully applied.  " + JSON.stringify(data), "error");
    });
}

// General Helper
async function postData(url, data) {
  return await fetch(url, {
    method: 'POST',
    cache: 'no-cache',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify(data)
  }).then((response) => {
    if (response.status >= 400 && response.status < 600) {
      response.text().then(t => {
        console.log("Bad response from server: " + t);
      });
      throw new Error("Bad response from server.");
    }
    else {
      try {
        return response.json();
      }
      catch {
        return response.text();
      }
    }
  });
}

var bootstrap = decisionApproval_Simple_htmlLifecycles;
var mount = decisionApproval_Simple_htmlLifecycles;
var unmount = decisionApproval_Simple_htmlLifecycles;
