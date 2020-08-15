//docs.google.com/presentation/d/1XgKaFEgPIzF2psVgY62-KnylV81gsjCWu999h4QtaOE/
var fs = require("fs");
var glob = require("glob");
var proj4 = require("./proj4.js");

var excludeFiles = ["map", "china_geo", "china_city_geo"];
glob("src/*.json", {}, function (err, files) {
  files.forEach(function (file) {
    var fileName = file.replace("src/", "").replace(".json", "");
    var output = "dist/" + fileName + ".js";
    var rawStr = fs.readFileSync(file, "utf8");
    var json = JSON.parse(rawStr);
    console.log(output);
    // Meta tag
    json.UTF8Encoding = true;

    if (excludeFiles.indexOf(fileName) < 0) {
      fs.writeFileSync(
        output,
        addAMDWrapper(JSON.stringify(json), fileName),
        "utf8"
      );
    }
  });
});

//var a = {"type":"FeatureCollection","features":[{"type":"Feature","id":"8100","properties":{"name":"香港","cp":[114.2784,22.3057],"childNum":1},"geometry":{"type":"Polygon","coordinates":[[[114.3333,22.1457],[114.2894,22.1457],[114.2592,22.1361],[114.2413,22.1457],[113.9447,22.1457],[113.9268,22.134],[113.9008,22.1395],[113.8376,22.1807],[113.8225,22.2144],[113.8445,22.2645],[113.8527,22.27],[113.8733,22.3304],[113.8747,22.4258],[113.9529,22.4691],[113.9996,22.5076],[114.0038,22.5069],[114.0134,22.4993],[114.0175,22.4979],[114.0271,22.4993],[114.0285,22.5014],[114.0326,22.5034],[114.0395,22.5021],[114.0491,22.5021],[114.0573,22.4993],[114.0614,22.5014],[114.0628,22.5082],[114.0683,22.5137],[114.0793,22.5144],[114.0807,22.513],[114.082,22.5124],[114.0875,22.5158],[114.0903,22.5192],[114.0903,22.5213],[114.0848,22.5247],[114.0834,22.5268],[114.0848,22.5282],[114.0903,22.5302],[114.0944,22.5336],[114.0971,22.5343],[114.1026,22.5316],[114.1081,22.5323],[114.1081,22.5288],[114.1095,22.5295],[114.1109,22.5323],[114.1122,22.5316],[114.1136,22.5336],[114.115,22.5336],[114.115,22.5282],[114.1177,22.5268],[114.1205,22.5282],[114.1219,22.5323],[114.126,22.5316],[114.126,22.533],[114.1273,22.533],[114.1273,22.5357],[114.1301,22.5378],[114.1328,22.5371],[114.1342,22.5391],[114.137,22.5398],[114.1397,22.5385],[114.1425,22.5405],[114.1438,22.5412],[114.1493,22.5391],[114.1493,22.5385],[114.1521,22.5391],[114.1534,22.5391],[114.1534,22.5419],[114.1562,22.5439],[114.1562,22.5453],[114.1548,22.5446],[114.1548,22.546],[114.1548,22.5481],[114.1562,22.5488],[114.1576,22.5522],[114.1617,22.5529],[114.1644,22.5577],[114.1658,22.5591],[114.1685,22.5563],[114.1727,22.5584],[114.1754,22.557],[114.1823,22.557],[114.1837,22.5529],[114.1864,22.5515],[114.1864,22.5529],[114.1919,22.5515],[114.1933,22.5529],[114.1946,22.5515],[114.1974,22.5529],[114.2194,22.5522],[114.2221,22.5529],[114.2249,22.5508],[114.2262,22.5488],[114.229,22.5481],[114.2303,22.546],[114.2303,22.5426],[114.2317,22.5412],[114.2331,22.5412],[114.2358,22.5433],[114.2358,22.5453],[114.2482,22.5501],[114.2812,22.5625],[114.3375,22.5659],[114.4391,22.5591],[114.4597,22.5426],[114.4597,22.4657],[114.4748,22.4334],[114.4981,22.4176],[114.5064,22.4155],[114.5187,22.4155],[114.5407,22.4217],[114.5627,22.4306],[114.5586,22.4203],[114.5613,22.4135],[114.5641,22.408],[114.5929,22.3915],[114.6066,22.3448],[114.5943,22.3057],[114.5641,22.2528],[114.5311,22.2013],[114.4995,22.1629],[114.4556,22.1299],[114.4171,22.1237],[114.3333,22.1457]]]}}]};
// transProvince(a);

function transProvince(a) {
  var transform = {
    crs:
      "+proj=lcc +lat_1=18 +lat_2=24 +lat_0=21 +lon_0=114 +x_0=500000 +y_0=500000 +ellps=WGS72 +towgs84=0,0,1.9,0,0,0.814,-0.38 +units=m +no_defs",
    scale: 0.000129831107685,
    jsonres: 15.5,
    jsonmarginX: -999,
    jsonmarginY: 9851,
    xoffset: -3139937.49309,
    yoffset: 4358972.7486,
  };

  var crs = {
    type: "name",
    properties: {
      name: "urn:ogc:def:crs:EPSG:3415",
    },
  };

  var isArray = function (obj) {
    return Object.prototype.toString.call(obj) === "[object Array]";
  };

  /**
   * Get point from latLon using specified transform definition
   */
  var transformFromLatLon = function (latLon, transform) {
    if (proj4 === undefined) {
      // error(21);
      return {
        x: 0,
        y: null,
      };
    }

    var projected = proj4(transform.crs, [latLon.lon, latLon.lat]),
      cosAngle =
        transform.cosAngle ||
        (transform.rotation && Math.cos(transform.rotation)),
      sinAngle =
        transform.sinAngle ||
        (transform.rotation && Math.sin(transform.rotation)),
      rotated = transform.rotation
        ? [
            projected[0] * cosAngle + projected[1] * sinAngle,
            -projected[0] * sinAngle + projected[1] * cosAngle,
          ]
        : projected;

    return {
      x:
        ((rotated[0] - (transform.xoffset || 0)) * (transform.scale || 1) +
          (transform.xpan || 0)) *
          (transform.jsonres || 1) +
        (transform.jsonmarginX || 0),
      y:
        (((transform.yoffset || 0) - rotated[1]) * (transform.scale || 1) +
          (transform.ypan || 0)) *
          (transform.jsonres || 1) -
        (transform.jsonmarginY || 0),
    };
  };

  var transe = function (arr) {
    arr.forEach(function (v, key) {
      if (isArray(v[0])) {
        transe(v);
      } else {
        var positions = transformFromLatLon(
          {
            lat: v[1],
            lon: v[0],
          },
          transform
        );
        // var positions = $(".chart").highcharts().transformFromLatLon({
        //         lat: v[1],
        //         lon: v[0]
        //     },
        //     transform);
        v[1] = Math.floor(-1 * positions.y);
        v[0] = Math.floor(positions.x);
      }
    });
  };

  if (a.features) {
    a.features.forEach(function (f) {
      if (f.properties.cp) {
        // word map don't have cp
        f.properties.longitude = f.properties.cp[0];
        f.properties.latitude = f.properties.cp[1];
        delete f.properties.cp;
      }

      if (f.id.length === 6) {
        f.properties["hz-code"] = Number(f.id);
      } else if (f.id.length === 4) {
        f.properties["hz-code"] = Number(f.id + "00");
      } else if (f.id.length === 3) {
        // word map
        f.properties["hz-code"] = f.id;
      }

      delete f.id;
      var c = f.geometry.coordinates; // [[[23,23],[234,52]],[]]
      transe(c);

      //       val = ['lon','lat'];
      //       console.log('lon:',val[0],'lat:',val[1]);
    });
  }

  a.crs = crs;
  a["hc-transform"] = {
    default: transform,
  };
  console.log("down");
  return JSON.stringify(a);
}

function addAMDWrapper(jsonStr, fileName) {
  var json = JSON.parse(jsonStr);
  var result = transProvince(json);

  return ['Highcharts.maps["countries/cn/', fileName, '"] = ', result].join("");
}
