/**
 * Author: Garfield Fan
 * Company: Funraisin
 * Date: 15Jan2024
 */
class FunraisinLeaderboard {
  
  // funraisin site url and element needs
  constructor(target, base_url){
    
    // get funraisin site
    this.base_url = base_url;
    
    // get element you want to set your funraisin leader board
    this.element = document.querySelector(target);
    
    // api path
    this.path = "/customcode/api/get_leaderboard";
    
    // check if target element is valid
    if(this.element instanceof Element && this.element.getAttribute("role") === "clb"){
      
      // add child
      this.element.innerHTML = '<div class="funraisin clb-result"></div><div class="clb-loader"><div class="funraisin bg-loader"><div></div><div></div><div></div><div></div></div></div>';
      
      // add listener for pagination
      this.element.addEventListener("click", (event) => {
        
        // pagination with class name next-page and prev-page
        if (event.target.classList.contains("next-page") || event.target.classList.contains("prev-page")) {
          
          this.element.setAttribute("clb-loading","true");
          // load leaderbaord
          this.getLeaderboardPage(event.target.getAttribute("clb-param"));
        }
      });
    }else{console.warn("element not found/match.");}
  }

/**
 * API format and options:
 * leaderboard type(clb-type): raised(default) / distance / steps / duration
 * group of type(clb-group): individual(default) / team / organisation
 * property/options: clb-expiry / clb-org_id / clb-team_id / clb-event_id / clb-event_key / clb-history_id / clb-event_name / clb-diy_event_id / clb-activity_type / clb-max_num_pages / clb-offset / clb-autoload / clb-target_id
 * clb-customfield: {"customfield_name": [customfield_values,customfield_values,customfield_values...]}
 */
  initLeaderboard(){
    
    const type    = this.element.getAttribute("clb-type")?this.element.getAttribute("clb-type"):"raised";
		const group   = this.element.getAttribute("clb-group")?this.element.getAttribute("clb-group"):"individual";
		const data    = {type,group};
		this.element.setAttribute("clb-loading","true");
		if(this.element.getAttribute("clb-func")){data.func=this.element.getAttribute("clb-func")};
		if(this.element.getAttribute("clb-expiry")){data.expiry=this.element.getAttribute("clb-expiry")};
		if(this.element.getAttribute("clb-org_id")){data.org_id=this.element.getAttribute("clb-org_id")};
		if(this.element.getAttribute("clb-offset")){data.offset=this.element.getAttribute("clb-offset")};
		if(this.element.getAttribute("clb-team_id")){data.team_id=this.element.getAttribute("clb-team_id")};
		if(this.element.getAttribute("clb-event_id")){data.event_id=this.element.getAttribute("clb-event_id")};
		if(this.element.getAttribute("clb-target_id")){data.target_id=this.element.getAttribute("clb-target_id")};
		if(this.element.getAttribute("clb-event_key")){data.event_key=this.element.getAttribute("clb-event_key")};
		if(this.element.getAttribute("clb-history_id")){data.history_id=this.element.getAttribute("clb-history_id")};
		if(this.element.getAttribute("clb-event_name")){data.event_name=this.element.getAttribute("clb-event_name")};
		if(this.element.getAttribute("clb-customfield")){data.customfield=this.element.getAttribute("clb-customfield")};
		if(this.element.getAttribute("clb-diy_event_id")){data.diy_event_id=this.element.getAttribute("clb-diy_event_id")};
		if(this.element.getAttribute("clb-activity_type")){data.activity_type=this.element.getAttribute("clb-activity_type")};
		if(this.element.getAttribute("clb-max_num_pages")){data.max_num_pages=this.element.getAttribute("clb-max_num_pages")};
    this.getLeaderboardPage(this.objectToQueryString(data));
  }

  
  getLeaderboardPage(param){
    var url       = this.base_url + "/" + this.path;
    url           = url.replace(/([^:]\/)\/+/g, '$1');
    this.loadContent(url + "?" + param);
    this.element.setAttribute("clb-loading","false");
  }

  // object to url param
  objectToQueryString(obj) {
    return Object.keys(obj)
      .map(key => encodeURIComponent(key) + '=' + encodeURIComponent(obj[key]))
      .join('&');
  }

  loadContent(url) {
    const xhr = new XMLHttpRequest();
    const node = this.element.querySelector(".clb-result");
  
    xhr.onreadystatechange = function() {
      if (xhr.readyState === 4) {
        if (xhr.status === 200) {
          node.innerHTML = xhr.responseText;
        } else {
          console.error('Failed to load content:', xhr.statusText);
        }
      }
    };
    xhr.open('GET', url, true);
    xhr.send();
  }
}

if (typeof module !== "undefined" && typeof module.exports !== "undefined") {
  module.exports = FunraisinLeaderboard;
}


if (typeof window !== "undefined") {
  window.FunraisinLeaderboard = FunraisinLeaderboard;
}