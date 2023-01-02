class MenuDrawer extends HTMLElement {
  constructor() {
    super();

    this.drawerButtons = document.querySelectorAll(".menu-drawer__button");
    this.drawer = this.querySelector("#menu-drawer");

    // this.drawerButton.addEventListener("click", this.onButtonClick.bind(this));
    console.log(this.drawerButtons.length);
    for (let i = 0; i < this.drawerButtons.length; i++) {
      console.log(i);
      const button = this.drawerButtons[i];
      button.addEventListener("click", this.onButtonClick.bind(this));
    }
  }

  onButtonClick(event) {
    console.log("click");
    event.preventDefault();
    console.log(event.currentTarget);
    if (event.currentTarget.dataset.action === "open") {
      this.classList.add("menu-drawer--open");
      this.classList.remove("menu-drawer--close");
    }
    if (event.currentTarget.dataset.action === "close") {
      this.classList.add("menu-drawer--close");
      this.classList.remove("menu-drawer--open");
    }
  }
}

customElements.define("menu-drawer", MenuDrawer);
