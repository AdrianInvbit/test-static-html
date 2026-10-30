(function (root) {
  var APP_META = {
    id: "test-static-html",
    title: "ClonVercel Test Lab",
    version: "v0.1.0",
    commit: "No disponible",
    technology: "HTML, CSS y JavaScript"
  };

  function createCounter(initialValue) {
    var value = Number.isFinite(initialValue) ? initialValue : 0;

    return {
      getValue: function getValue() {
        return value;
      },
      increment: function increment() {
        value += 1;
        return value;
      },
      decrement: function decrement() {
        value -= 1;
        return value;
      },
      reset: function reset() {
        value = 0;
        return value;
      }
    };
  }

  function setText(documentRef, id, text) {
    var node = documentRef.getElementById(id);
    if (node) {
      node.textContent = text;
    }
  }

  function renderMeta(documentRef, meta) {
    setText(documentRef, "app-id", meta.id);
    setText(documentRef, "app-tech", meta.technology);
    setText(documentRef, "app-version", meta.version);
    setText(documentRef, "app-commit", meta.commit);
  }

  function markJavaScriptReady(documentRef) {
    var status = documentRef.getElementById("js-status");
    if (!status) {
      return;
    }

    status.dataset.state = "ready";
    status.textContent = "JavaScript inicializado correctamente";
  }

  function bindCounter(documentRef) {
    var output = documentRef.getElementById("counter-value");
    var incrementButton = documentRef.getElementById("btn-increment");
    var decrementButton = documentRef.getElementById("btn-decrement");
    var resetButton = documentRef.getElementById("btn-reset");
    var counter = createCounter(0);

    function render() {
      if (output) {
        output.textContent = String(counter.getValue());
      }
    }

    if (incrementButton) {
      incrementButton.addEventListener("click", function () {
        counter.increment();
        render();
      });
    }

    if (decrementButton) {
      decrementButton.addEventListener("click", function () {
        counter.decrement();
        render();
      });
    }

    if (resetButton) {
      resetButton.addEventListener("click", function () {
        counter.reset();
        render();
      });
    }

    render();
    return counter;
  }

  function mergeMeta(base, extra) {
    if (!extra || typeof extra !== "object") {
      return base;
    }

    return {
      id: extra.id || base.id,
      title: extra.title || base.title,
      version: extra.version || base.version,
      commit: extra.commit || base.commit,
      technology: extra.technology || base.technology
    };
  }

  function loadMeta(callback) {
    if (typeof fetch !== "function") {
      callback(APP_META);
      return;
    }

    fetch("app-meta.json")
      .then(function (response) {
        if (!response.ok) {
          throw new Error("No se pudo leer app-meta.json");
        }
        return response.json();
      })
      .then(function (data) {
        callback(mergeMeta(APP_META, data));
      })
      .catch(function () {
        callback(APP_META);
      });
  }

  function bootstrap(documentRef) {
    renderMeta(documentRef, APP_META);
    bindCounter(documentRef);
    markJavaScriptReady(documentRef);
    loadMeta(function (meta) {
      renderMeta(documentRef, meta);
    });
  }

  if (typeof document !== "undefined") {
    if (document.readyState === "loading") {
      document.addEventListener("DOMContentLoaded", function () {
        bootstrap(document);
      });
    } else {
      bootstrap(document);
    }
  }

  var api = {
    APP_META: APP_META,
    createCounter: createCounter,
    mergeMeta: mergeMeta,
    renderMeta: renderMeta,
    bindCounter: bindCounter,
    markJavaScriptReady: markJavaScriptReady
  };

  root.TestStaticHtml = api;

  if (typeof module !== "undefined" && module.exports) {
    module.exports = api;
  }
})(typeof globalThis !== "undefined" ? globalThis : this);
