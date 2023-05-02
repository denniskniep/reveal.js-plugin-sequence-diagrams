var RevealSequenceDiagram = () => ({
	id: "sequence-diagram",
	init: (Reveal) => {
    	var config = Reveal.getConfig().sequencediagrams;
        var className = "sequence-diagram";
        var classNameBuilt = "sequence-diagram-built";

    	function renderDiagrams(event){
    		var elements = Reveal.getCurrentSlide().getElementsByClassName(className);
    		for (var i = 0; i < elements.length; i++ ){
    			var diagramBlueprintElement = elements[i];

    			if (wasBuilt(diagramBlueprintElement)) {
        			continue
    			}
    			var diagramContainer = document.createElement("div");
    			diagramContainer.className = classNameBuilt
    			insertNodeBefore(diagramBlueprintElement, diagramContainer);
    			var diagramSyntax = diagramBlueprintElement.innerText;
    			var options = getOptions(diagramBlueprintElement);
    			createDiagram(diagramContainer, options, diagramSyntax);
    		}
    	}

    	function wasBuilt(node) {
    		return node.previousSibling && node.previousSibling.className === classNameBuilt
    	}

    	function insertNodeBefore(referenceNode, newNode) {
    		referenceNode.parentNode.insertBefore(newNode, referenceNode);
    	}

    	function createDiagram(diagramContainer, options, diagramSyntax) {
    		var diagram = Diagram.parse(diagramSyntax);
    		listenToDiagramIsRendered(diagramContainer, options, makeFragmentsIfRequired);
    		diagram.drawSVG(diagramContainer, { theme: options.theme });
    	}

    	function listenToDiagramIsRendered(diagramContainer, options, callback){
    		var observer = new MutationObserver(function (e) {

    			Reveal.sync();
    			callback(diagramContainer, options)

    			if(config && config.initialize){
    				config.initialize(diagramContainer);
    			}

    			this.disconnect();
    		});

    		observer.observe(diagramContainer, { childList: true });
    	}

    	function makeFragmentsIfRequired(diagramContainer, options){
    		if (options.useFragments && diagramContainer) {
    			var svg =  diagramContainer;
    			var signalElements = svg.querySelectorAll('.signal, .note');
    			for(var signalElementKey in signalElements){
    				var signalElement = signalElements[signalElementKey];
    				if(signalElement.classList){
    					signalElement.classList.add('fragment');
    				}
    			}
    		}
    	}

    	function getOptions(element){

    		var useFragments = getOption(element, "useFragments", false);
    		if(typeof useFragments == "string"){
    			useFragments = useFragments.toLowerCase() == "true";
    		}

    		return {
    			theme : getOption(element, "theme", "simple"),
    			useFragments : useFragments,
    		};
    	}

    	function getOption(element, key, defaultOption){
    		if(element.hasAttribute("data-config-"+key)){
    			return element.attributes["data-config-"+key].value;
    		}

    		if(config && config.hasOwnProperty(key)){
    			return config[key];
    		}

    		return defaultOption;
    	}

    	Reveal.addEventListener('ready',renderDiagrams);
    	Reveal.addEventListener('slidechanged',renderDiagrams);
	}
})
