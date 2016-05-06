require.config({
    //baseUrl: 'http://localhost/',
    paths:{
        "jquery":"/js/vendor/jquery-2.1.1.min",
        "d3":"/js/vendor/d3.v3.min",
        "react":"/js/vendor/react",
        "react-dom":"/js/vendor/react-dom.min",
        "apollo_view":"/js/jsx/build/apollo_view",
        "chart":"/js/apollo/chart",
        "index":"/js/apollo/index"
    },
    shim:{
        "apollo_view":["react","react-dom"],
        "react-dom":["react"],
        "chart":["d3"]
    }
});


require(["jquery","react","index","apollo_view","d3"],function(jquery,R,Public,view){
    console.log(Public);
    Public.main();
});
