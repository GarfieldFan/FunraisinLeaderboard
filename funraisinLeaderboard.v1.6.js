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
    if(target instanceof Element){
      
      this.element = target;
    }else if( target.target instanceof Element){

      this.element = target.target;
    }else{
      
      this.element = document.querySelector(target);
    }
    
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
    }else{console.warn("Invalid or missing target element with role 'clb'.");}
  }

/**
 * API format and options:
 * leaderboard type(clb-type): raised(default) / distance / steps / duration
 * group of type(clb-group): individual(default) / team / organisation
 * property/options: clb-expiry / clb-org_id / clb-team_id / clb-event_id / clb-event_key / clb-history_id / clb-event_name / clb-diy_event_id / clb-activity_type / clb-max_num_pages / clb-offset / clb-autoload / clb-target_id
 * clb-customfield: {"customfield_name": [customfield_values,customfield_values,customfield_values...]}
 */
  initLeaderboard(){
    
    const type    = this.element.getAttribute("clb-type") || "raised";
    const group   = this.element.getAttribute("clb-group") || "individual";
		const data    = {type,group};
		this.element.setAttribute("clb-loading","true");
		
    const optionalAttributes = ["clb-func", "clb-expiry", "clb-org_id", "clb-offset", "clb-team_id", "clb-event_id", "clb-target_id", "clb-event_key", "clb-history_id", "clb-event_name", "clb-customfield", "clb-diy_event_id", "clb-activity_type", "clb-max_num_pages"];
    
    optionalAttributes.forEach(attribute => {
      const value = this.element.getAttribute(attribute);
      if (value) {
        data[attribute.replace("clb-", "")] = value;
      }
    });
    this.getLeaderboardPage(this.objectToQueryString(data));
  }

  
  getLeaderboardPage(param){
    const url = `${this.base_url}/${this.path}`.replace(/([^:]\/)\/+/g, '$1');
    this.loadContent(`${url}?${param}`);
  }

  // object to url param
  objectToQueryString(obj) {
    return Object.keys(obj)
      .map(key => encodeURIComponent(key) + '=' + encodeURIComponent(obj[key]))
      .join('&');
  }

  loadContent(url) {
    fetch(url)
      .then(response => {
        if (!response.ok) {
          throw new Error(`Failed to load content: ${response.statusText}`);
        }
        return response.text();
      })
      .then(content => {
        this.element.querySelector(".clb-result").innerHTML = content;
      })
      .catch(error => {
        console.error(error);
        this.element.querySelector(".clb-result").innerHTML = "Fail to connect with Funraisin servers";
      })
      .finally(() => {
        this.element.setAttribute("clb-loading", "false");
      });
  }
}

if (typeof module !== "undefined" && typeof module.exports !== "undefined") {
  module.exports = FunraisinLeaderboard;
}


if (typeof window !== "undefined") {
  window.FunraisinLeaderboard = FunraisinLeaderboard;
}