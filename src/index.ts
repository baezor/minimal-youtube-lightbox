class MinimalYTLightbox {
  constructor(selector, lightBoxClass) {
    this.triggers = document.querySelectorAll(`.${selector}`);
    this.lightbox = document.querySelector(`.${lightBoxClass}`);
    this.closeLightbox = this.lightbox.querySelector(".close-lightbox");
    this.youtubeScriptID = "youtube-api";
  }
  checkIfYoutubeScriptIsLoaded() {
    return document.getElementById(this.youtubeScriptID) !== null;
  }
  appendYoutubeScript() {
    console.log("appendYoutubeScript");
    let tag = document.createElement("script");
    let firstScript = document.getElementsByTagName("script")[0];
    tag.src = "https://www.youtube.com/iframe_api";
    tag.id = this.youtubeScriptID;
    firstScript.parentNode.insertBefore(tag, firstScript);
  }
  getYoutubeVideoIDFromURL(url) {
    var regExp =
      /^.*(youtu.be\/|v\/|u\/\w\/|embed\/|watch\?v=|\&v=)([^#\&\?]*).*/;
    var match = url.match(regExp);

    if (match && match[2].length == 11) {
      return match[2];
    } else {
      return "error";
    }
  }
  onPlayerReady(event) {
    console.log("onPlayerReady");
    //event.target.playVideo();
  }
  onPlayerStateChange(event) {
    console.log("onPlayerStateChange");
  }

  createVideoElement(videoID) {
    if (window.player) {
      window.player.destroy();
    }
    const node = this.lightbox.querySelector(".youtube-player-container");
    // if node has children
    if (node.hasChildNodes()) {
      // remove all children
      while (node.firstChild) {
        node.removeChild(node.firstChild);
      }
    }
    const youtubeNode = document.createElement("div");
    node.insertBefore(youtubeNode, node.firstChild);

    window.player = new YT.Player(youtubeNode, {
      videoId: videoID,
      playerVars: {
        autoplay: 0,
        controls: 0,
        modestbranding: 1,
        rel: 0,
        showinfo: 0,
        fs: 0,
        cc_load_policy: 0,
        iv_load_policy: 3,
        autohide: 0,
      },
      events: {
        onReady: this.onPlayerReady,
        onStateChange: this.onPlayerStateChange,
      },
    });
  }
  init() {
    if (!this.checkIfYoutubeScriptIsLoaded()) {
      this.appendYoutubeScript();
    }
    if (!this.triggers || !this.lightbox) {
      return;
    }

    this.triggers.forEach((trigger) => {
      trigger.addEventListener("click", (e) => {
        e.preventDefault();
        console.log("clicked");
        this.lightbox.classList.add("active");
        const videoID = this.getYoutubeVideoIDFromURL(trigger.dataset.video);
        this.createVideoElement(videoID);
      });
    });
    this.closeLightbox.addEventListener("click", (e) => {
      e.preventDefault();
      this.lightbox.classList.remove("active");
      if (window.player) {
        window.player.stopVideo();
        window.player.destroy();
      }
    });
  }
}

export default MinimalYTLightbox;
