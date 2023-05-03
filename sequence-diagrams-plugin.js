var RevealSequenceDiagram = () => ({
	id: "sequence-diagram",
	init: (Reveal) => {
    	var config = Reveal.getConfig().sequencediagrams;
        var className = "sequence-diagram";

    	function renderDiagrams(event){
    		var elements = Reveal.getCurrentSlide().getElementsByClassName(className);
    		for (var i = 0; i < elements.length; i++ ){
    			var diagramBlueprintElement = elements[i];

    			if (wasBuilt(diagramBlueprintElement)) {
        			continue
    			}
    			var diagramSyntax = diagramBlueprintElement.textContent;
    			diagramBlueprintElement.innerHTML = "";
    			var options = getOptions(diagramBlueprintElement);
    			createDiagram(diagramBlueprintElement, options, diagramSyntax);
    		}
    	}

    	function wasBuilt(node) {
    		return node.firstChild.tagName == 'svg'
    	}

    	function insertNodeBefore(referenceNode, newNode) {
    		referenceNode.parentNode.insertBefore(newNode, referenceNode);
    	}

    	function createViewbox(svg) {
    		svg.setAttribute('viewBox', '0 0 ' + parseInt(svg.getAttribute('width'), 10) + ' ' + parseInt(svg.getAttribute('height'),10));
    		svg.setAttribute('preserveAspectRatio', 'xMidYMid');
    		svg.style.width = "100%"
    		svg.style.height = "100%"
    	}

    	function createDiagram(diagramContainer, options, diagramSyntax) {
    		var diagram = Diagram.parse(diagramSyntax);
    		listenToDiagramIsRendered(diagramContainer, options, onRendered);
    		diagram.drawSVG(diagramContainer, { theme: options.theme });
    	}

    	function onRendered(diagramContainer, options) {
        	makeFragmentsIfRequired(diagramContainer, options)
        	createViewbox(diagramContainer.firstChild)
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
