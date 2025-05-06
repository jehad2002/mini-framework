// MiniFrame Framework

// State Management
class State {
    constructor(initialState = {}) {
      this.state = initialState;
      this.listeners = [];
    }
  
    // Set the state and notify listeners
    setState(newState) {
      this.state = { ...this.state, ...newState };
      this.listeners.forEach(listener => listener(this.state));
    }
  
    // Subscribe to state changes
    subscribe(listener) {
      this.listeners.push(listener);
    }
  
    // Get current state
    getState() {
      return this.state;
    }
  }
  
  // Event handling (simplified for framework)
  class EventHandler {
    static addEvent(element, event, callback) {
      element.addEventListener(event, callback);
    }
  }
  
  // DOM creation (virtual DOM style)
  class MiniFrame {
    static createElement({ tag, attrs = {}, children = [], events = {} }) {
      const element = document.createElement(tag);
  
      // Set attributes
      for (const [key, value] of Object.entries(attrs)) {
        element.setAttribute(key, value);
      }
  
      // Add event listeners
      for (const [event, handler] of Object.entries(events)) {
        EventHandler.addEvent(element, event, handler);
      }
  
      // Add children elements recursively
      children.forEach(child => {
        if (typeof child === 'string') {
          element.textContent = child;
        } else {
          element.appendChild(MiniFrame.createElement(child));
        }
      });
  
      return element;
    }
  
    static renderApp(appFunc) {
      const root = document.getElementById('root');
      root.innerHTML = '';
      root.appendChild(appFunc());
    }
  }
  
  // Routing System (simple hash routing)
  class Router {
    static initialize() {
      window.addEventListener('hashchange', Router.updateRoute);
      Router.updateRoute();
    }
  
    static updateRoute() {
      const hash = window.location.hash.slice(1);
      const [route, ...params] = hash.split('/');
      Router.currentRoute = route || 'home';
      Router.params = params;
    }
  
    static getCurrentRoute() {
      return Router.currentRoute;
    }
  
    static getParams() {
      return Router.params;
    }
  }
  
  export { MiniFrame, State, Router };