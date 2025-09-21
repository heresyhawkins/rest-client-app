import { RequestType } from '@types';

export const requestFull: RequestType = {
  method: 'POST',
  url: 'http://localhost:8080',
  headers: {
    'Content-Type': 'application/json',
    Accept: 'application/json',
  },
  body: JSON.stringify({
    text: 'text',
    prop1: 'prop1',
    prop2: 'prop2',
  }),
};

export const requestFullPut: RequestType = {
  method: 'PUT',
  url: 'http://localhost:8080',
  headers: {
    Accept: 'application/json',
    'Content-Type': 'application/json',
  },
  body: JSON.stringify({
    text: 'text',
    prop1: 'prop1',
    prop2: 'prop2',
  }),
};

export const requestFullPlainText: RequestType = {
  method: 'POST',
  url: 'http://localhost:8080',
  headers: {
    Accept: 'application/json',
    'Content-Type': 'text/plain',
  },
  body: JSON.stringify({
    text: 'text',
    prop1: 'prop1',
    prop2: 'prop2',
  }),
};

export const requestWithoutBody: RequestType = {
  method: 'POST',
  url: 'http://localhost:8080',
  headers: {
    Accept: 'application/json',
    'Content-Type': 'application/json',
  },
};

export const requestWithoutBodyAndHeaders: RequestType = {
  method: 'GET',
  url: 'http://localhost:8080',
};

export const requestEmpty: RequestType = {
  method: 'GET',
};

export const generatedCodeFull = {
  curl:
    "curl --location 'http://localhost:8080' \\\n" +
    "--header 'Content-Type: application/json' \\\n" +
    "--header 'Accept: application/json' \\\n" +
    "--data '{\n" +
    '    "text": "text",\n' +
    '    "prop1": "prop1",\n' +
    '    "prop2": "prop2"\n' +
    "}'",
  fetch:
    'const myHeaders = new Headers();\n' +
    "myHeaders.append('Content-Type', 'application/json');\n" +
    "myHeaders.append('Accept', 'application/json');\n" +
    '\n' +
    'const raw = JSON.stringify({\n' +
    '  "text": "text",\n' +
    '  "prop1": "prop1",\n' +
    '  "prop2": "prop2"\n' +
    '});\n' +
    '\n' +
    'const requestOptions = {\n' +
    '  method: "POST",\n' +
    '  headers: myHeaders,\n' +
    '  body: raw,\n' +
    '  redirect: "follow"\n' +
    '};\n' +
    '\n' +
    'fetch("http://localhost:8080", requestOptions)\n' +
    '  .then((response) => response.text())\n' +
    '  .then((result) => console.log(result))\n' +
    '  .catch((error) => console.error(error));',
  xhr:
    'var data = JSON.stringify({\n' +
    '  "text": "text",\n' +
    '  "prop1": "prop1",\n' +
    '  "prop2": "prop2"\n' +
    '});\n' +
    '\n' +
    'var xhr = new XMLHttpRequest();\n' +
    'xhr.withCredentials = true;\n' +
    '\n' +
    'xhr.addEventListener("readystatechange", function() {\n' +
    '  if(this.readyState === 4) {\n' +
    '    console.log(this.responseText);\n' +
    '  }\n' +
    '});\n' +
    '\n' +
    'xhr.open("POST", "http://localhost:8080");\n' +
    'xhr.setRequestHeader("Content-Type", "application/json");\n' +
    'xhr.setRequestHeader("Accept", "application/json");\n' +
    '\n' +
    'xhr.send(data);',
  python:
    'import requests\n' +
    'import json\n' +
    '\n' +
    'url = "http://localhost:8080"\n' +
    '\n' +
    'payload = json.dumps({\n' +
    '  "text": "text",\n' +
    '  "prop1": "prop1",\n' +
    '  "prop2": "prop2"\n' +
    '})\n' +
    'headers = {\n' +
    "  'Content-Type': 'application/json',\n" +
    "  'Accept': 'application/json'\n" +
    '}\n' +
    '\n' +
    'response = requests.request("POST", url, headers=headers, data=payload)\n' +
    '\n' +
    'print(response.text)',
  nodejs:
    "var request = require('request');\n" +
    'var options = {\n' +
    "  'method': 'POST',\n" +
    "  'url': 'http://localhost:8080',\n" +
    "  'headers': {\n" +
    "    'Content-Type': 'application/json',\n" +
    "    'Accept': 'application/json'\n" +
    '  }\n' +
    '  body: JSON.stringify({\n' +
    '  "text": "text",\n' +
    '  "prop1": "prop1",\n' +
    '  "prop2": "prop2"\n' +
    '})\n' +
    '};\n' +
    'request(options, function (error, response) {\n' +
    '  if (error) throw new Error(error);\n' +
    '  console.log(response.body);\n' +
    '});',
  java:
    'Unirest.setTimeouts(0, 0);\n' +
    'HttpResponse<String> response = Unirest.post("http://localhost:8080")\n' +
    '  .header("Content-Type", "application/json")\n' +
    '  .header("Accept", "application/json")\n' +
    '  .body("{\\r\\n  \\"text\\": \\"text\\",\\r\\n  \\"prop1\\": \\"prop1\\",\\r\\n  \\"prop2\\": \\"prop2\\"\\r\\n}")\n' +
    '  .asString();',
  'c#':
    'var options = new RestClientOptions("")\n' +
    '{\n' +
    '  MaxTimeout = -1,\n' +
    '};\n' +
    'var client = new RestClient(options);\n' +
    'var request = new RestRequest("http://localhost:8080", Method.Post);\n' +
    'request.AddHeader("Content-Type", "application/json");\n' +
    'request.AddHeader("Accept", "application/json");\n' +
    'var body = @"{\n' +
    '" + "\\n" +\n' +
    '@"  ""text"": ""text"",\n' +
    '" + "\\n" +\n' +
    '@"  ""prop1"": ""prop1"",\n' +
    '" + "\\n" +\n' +
    '@"  ""prop2"": ""prop2""\n' +
    '" + "\\n" +\n' +
    '@"}";\n' +
    'request.AddStringBody(body, DataFormat.Json);\n' +
    'RestResponse response = await client.ExecuteAsync(request);\n' +
    'Console.WriteLine(response.Content);',
  go:
    'package main\n' +
    '\n' +
    'import (\n' +
    '  "fmt"\n' +
    '  "strings"\n' +
    '  "net/http"\n' +
    '  "io"\n' +
    ')\n' +
    '\n' +
    'func main() {\n' +
    '\n' +
    '  url := "http://localhost:8080"\n' +
    '  method := "POST"\n' +
    '\n' +
    '  payload := strings.NewReader(`{`+"\n' +
    '"+`\n' +
    '  "text": "text",`+"\n' +
    '"+`\n' +
    '  "prop1": "prop1",`+"\n' +
    '"+`\n' +
    '  "prop2": "prop2"`+"\n' +
    '"+`\n' +
    '}`)\n' +
    '\n' +
    '  client := &http.Client {\n' +
    '  }\n' +
    '  req, err := http.NewRequest(method, url, payload)\n' +
    '\n' +
    '  if err != nil {\n' +
    '    fmt.Println(err)\n' +
    '    return\n' +
    '  }\n' +
    '  req.Header.Add("Content-Type", "application/json")\n' +
    '  req.Header.Add("Accept", "application/json")\n' +
    '\n' +
    '  res, err := client.Do(req)\n' +
    '  if err != nil {\n' +
    '    fmt.Println(err)\n' +
    '    return\n' +
    '  }\n' +
    '  defer res.Body.Close()\n' +
    '\n' +
    '  body, err := io.ReadAll(res.Body)\n' +
    '  if err != nil {\n' +
    '    fmt.Println(err)\n' +
    '    return\n' +
    '  }\n' +
    '  fmt.Println(string(body))\n' +
    '}',
};

export const generatedCodeWithoutBody = {
  curl:
    "curl --location --request POST 'http://localhost:8080' \\\n" +
    "--header 'Accept: application/json' \\\n" +
    "--header 'Content-Type: application/json'",
  fetch:
    'const myHeaders = new Headers();\n' +
    `myHeaders.append('Accept', 'application/json');\n` +
    `myHeaders.append('Content-Type', 'application/json');\n` +
    '\n' +
    'const requestOptions = {\n' +
    '  method: "POST",\n' +
    '  headers: myHeaders,\n' +
    '  redirect: "follow"\n' +
    '};\n' +
    '\n' +
    'fetch("http://localhost:8080", requestOptions)\n' +
    '  .then((response) => response.text())\n' +
    '  .then((result) => console.log(result))\n' +
    '  .catch((error) => console.error(error));',
  xhr:
    'var xhr = new XMLHttpRequest();\n' +
    'xhr.withCredentials = true;\n' +
    '\n' +
    'xhr.addEventListener("readystatechange", function() {\n' +
    '  if(this.readyState === 4) {\n' +
    '    console.log(this.responseText);\n' +
    '  }\n' +
    '});\n' +
    '\n' +
    'xhr.open("POST", "http://localhost:8080");\n' +
    'xhr.setRequestHeader("Accept", "application/json");\n' +
    'xhr.setRequestHeader("Content-Type", "application/json");\n' +
    '\n' +
    'xhr.send();',
  nodejs:
    "var request = require('request');\n" +
    'var options = {\n' +
    "  'method': 'POST',\n" +
    "  'url': 'http://localhost:8080',\n" +
    "  'headers': {\n" +
    "    'Accept': 'application/json',\n" +
    "    'Content-Type': 'application/json'\n" +
    '  }\n' +
    '};\n' +
    'request(options, function (error, response) {\n' +
    '  if (error) throw new Error(error);\n' +
    '  console.log(response.body);\n' +
    '});',
  python:
    'import requests\n' +
    'import json\n' +
    '\n' +
    'url = "http://localhost:8080"\n' +
    '\n' +
    'payload = {}\n' +
    'headers = {\n' +
    "  'Accept': 'application/json',\n" +
    "  'Content-Type': 'application/json'\n" +
    '}\n' +
    '\n' +
    'response = requests.request("POST", url, headers=headers, data=payload)\n' +
    '\n' +
    'print(response.text)',
  java:
    'Unirest.setTimeouts(0, 0);\n' +
    'HttpResponse<String> response = Unirest.post("http://localhost:8080")\n' +
    '  .header("Accept", "application/json")\n' +
    '  .header("Content-Type", "application/json")\n' +
    '  .asString();',
  'c#':
    'var options = new RestClientOptions("")\n' +
    '{\n' +
    '  MaxTimeout = -1,\n' +
    '};\n' +
    'var client = new RestClient(options);\n' +
    'var request = new RestRequest("http://localhost:8080", Method.Post);\n' +
    'request.AddHeader("Accept", "application/json");\n' +
    'request.AddHeader("Content-Type", "application/json");\n' +
    'RestResponse response = await client.ExecuteAsync(request);\n' +
    'Console.WriteLine(response.Content);',
  go:
    'package main\n' +
    '\n' +
    'import (\n' +
    '  "fmt"\n' +
    '  "net/http"\n' +
    '  "io"\n' +
    ')\n' +
    '\n' +
    'func main() {\n' +
    '\n' +
    '  url := "http://localhost:8080"\n' +
    '  method := "POST"\n' +
    '\n' +
    '  client := &http.Client {\n' +
    '  }\n' +
    '  req, err := http.NewRequest(method, url, nil)\n' +
    '\n' +
    '  if err != nil {\n' +
    '    fmt.Println(err)\n' +
    '    return\n' +
    '  }\n' +
    '  req.Header.Add("Accept", "application/json")\n' +
    '  req.Header.Add("Content-Type", "application/json")\n' +
    '\n' +
    '  res, err := client.Do(req)\n' +
    '  if err != nil {\n' +
    '    fmt.Println(err)\n' +
    '    return\n' +
    '  }\n' +
    '  defer res.Body.Close()\n' +
    '\n' +
    '  body, err := io.ReadAll(res.Body)\n' +
    '  if err != nil {\n' +
    '    fmt.Println(err)\n' +
    '    return\n' +
    '  }\n' +
    '  fmt.Println(string(body))\n' +
    '}',
};

export const generatedCodeWithoutBodyAndHeaders = {
  curl: `curl --location 'http://localhost:8080'`,
  fetch:
    'const requestOptions = {\n' +
    '  method: "GET",\n' +
    '  redirect: "follow"\n' +
    '};\n' +
    '\n' +
    'fetch("http://localhost:8080", requestOptions)\n' +
    '  .then((response) => response.text())\n' +
    '  .then((result) => console.log(result))\n' +
    '  .catch((error) => console.error(error));',
  xhr:
    'var xhr = new XMLHttpRequest();\n' +
    'xhr.withCredentials = true;\n' +
    '\n' +
    'xhr.addEventListener("readystatechange", function() {\n' +
    '  if(this.readyState === 4) {\n' +
    '    console.log(this.responseText);\n' +
    '  }\n' +
    '});\n' +
    '\n' +
    'xhr.open("GET", "http://localhost:8080");\n' +
    '\n' +
    'xhr.send();',
  nodejs:
    "var request = require('request');\n" +
    'var options = {\n' +
    "  'method': 'GET',\n" +
    "  'url': 'http://localhost:8080',\n" +
    "  'headers': {\n" +
    '  }\n' +
    '};\n' +
    'request(options, function (error, response) {\n' +
    '  if (error) throw new Error(error);\n' +
    '  console.log(response.body);\n' +
    '});',
  java:
    'Unirest.setTimeouts(0, 0);\n' +
    'HttpResponse<String> response = Unirest.get("http://localhost:8080")\n' +
    '  .asString();',
  python:
    'import requests\n' +
    '\n' +
    'url = "http://localhost:8080"\n' +
    '\n' +
    'payload = {}\n' +
    'headers = {}\n' +
    '\n' +
    'response = requests.request("GET", url, headers=headers, data=payload)\n' +
    '\n' +
    'print(response.text)',
  'c#':
    'var options = new RestClientOptions("")\n' +
    '{\n' +
    '  MaxTimeout = -1,\n' +
    '};\n' +
    'var client = new RestClient(options);\n' +
    'var request = new RestRequest("http://localhost:8080", Method.Get);\n' +
    'RestResponse response = await client.ExecuteAsync(request);\n' +
    'Console.WriteLine(response.Content);',
  go:
    'package main\n' +
    '\n' +
    'import (\n' +
    '  "fmt"\n' +
    '  "net/http"\n' +
    '  "io"\n' +
    ')\n' +
    '\n' +
    'func main() {\n' +
    '\n' +
    '  url := "http://localhost:8080"\n' +
    '  method := "GET"\n' +
    '\n' +
    '  client := &http.Client {\n' +
    '  }\n' +
    '  req, err := http.NewRequest(method, url, nil)\n' +
    '\n' +
    '  if err != nil {\n' +
    '    fmt.Println(err)\n' +
    '    return\n' +
    '  }\n' +
    '  res, err := client.Do(req)\n' +
    '  if err != nil {\n' +
    '    fmt.Println(err)\n' +
    '    return\n' +
    '  }\n' +
    '  defer res.Body.Close()\n' +
    '\n' +
    '  body, err := io.ReadAll(res.Body)\n' +
    '  if err != nil {\n' +
    '    fmt.Println(err)\n' +
    '    return\n' +
    '  }\n' +
    '  fmt.Println(string(body))\n' +
    '}',
};

export const generatedCodeCurlPut =
  "curl --location --request PUT 'http://localhost:8080' \\\n" +
  "--header 'Accept: application/json' \\\n" +
  "--header 'Content-Type: application/json' \\\n" +
  "--data '{\n" +
  '    "text": "text",\n' +
  '    "prop1": "prop1",\n' +
  '    "prop2": "prop2"\n' +
  "}'";

export const generatedCodePlainTextCSharp =
  'var options = new RestClientOptions("")\n' +
  '{\n' +
  '  MaxTimeout = -1,\n' +
  '};\n' +
  'var client = new RestClient(options);\n' +
  'var request = new RestRequest("http://localhost:8080", Method.Post);\n' +
  'request.AddHeader("Accept", "application/json");\n' +
  'request.AddHeader("Content-Type", "text/plain");\n' +
  'var body = @"{\n' +
  '" + "\\n" +\n' +
  '@"  ""text"": ""text"",\n' +
  '" + "\\n" +\n' +
  '@"  ""prop1"": ""prop1"",\n' +
  '" + "\\n" +\n' +
  '@"  ""prop2"": ""prop2""\n' +
  '" + "\\n" +\n' +
  '@"}";\n' +
  'request.AddParameter("text/plain", body, ParameterType.RequestBody);\n' +
  'RestResponse response = await client.ExecuteAsync(request);\n' +
  'Console.WriteLine(response.Content);';

export const generatedCodeEmpty = {
  curl: `curl --location ''`,
  fetch:
    'const requestOptions = {\n' +
    '  method: "GET",\n' +
    '  redirect: "follow"\n' +
    '};\n' +
    '\n' +
    'fetch("", requestOptions)\n' +
    '  .then((response) => response.text())\n' +
    '  .then((result) => console.log(result))\n' +
    '  .catch((error) => console.error(error));',
  xhr:
    'var xhr = new XMLHttpRequest();\n' +
    'xhr.withCredentials = true;\n' +
    '\n' +
    'xhr.addEventListener("readystatechange", function() {\n' +
    '  if(this.readyState === 4) {\n' +
    '    console.log(this.responseText);\n' +
    '  }\n' +
    '});\n' +
    '\n' +
    'xhr.open("GET", "");\n' +
    '\n' +
    'xhr.send();',
  nodejs:
    "var request = require('request');\n" +
    'var options = {\n' +
    "  'method': 'GET',\n" +
    "  'url': '',\n" +
    "  'headers': {\n" +
    '  }\n' +
    '};\n' +
    'request(options, function (error, response) {\n' +
    '  if (error) throw new Error(error);\n' +
    '  console.log(response.body);\n' +
    '});',
  java:
    'Unirest.setTimeouts(0, 0);\n' +
    'HttpResponse<String> response = Unirest.get("")\n' +
    '  .asString();',
  python:
    'import requests\n' +
    '\n' +
    'url = ""\n' +
    '\n' +
    'payload = {}\n' +
    'headers = {}\n' +
    '\n' +
    'response = requests.request("GET", url, headers=headers, data=payload)\n' +
    '\n' +
    'print(response.text)',
  'c#':
    'var options = new RestClientOptions("")\n' +
    '{\n' +
    '  MaxTimeout = -1,\n' +
    '};\n' +
    'var client = new RestClient(options);\n' +
    'var request = new RestRequest("", Method.Get);\n' +
    'RestResponse response = await client.ExecuteAsync(request);\n' +
    'Console.WriteLine(response.Content);',
  go:
    'package main\n' +
    '\n' +
    'import (\n' +
    '  "fmt"\n' +
    '  "net/http"\n' +
    '  "io"\n' +
    ')\n' +
    '\n' +
    'func main() {\n' +
    '\n' +
    '  url := ""\n' +
    '  method := "GET"\n' +
    '\n' +
    '  client := &http.Client {\n' +
    '  }\n' +
    '  req, err := http.NewRequest(method, url, nil)\n' +
    '\n' +
    '  if err != nil {\n' +
    '    fmt.Println(err)\n' +
    '    return\n' +
    '  }\n' +
    '  res, err := client.Do(req)\n' +
    '  if err != nil {\n' +
    '    fmt.Println(err)\n' +
    '    return\n' +
    '  }\n' +
    '  defer res.Body.Close()\n' +
    '\n' +
    '  body, err := io.ReadAll(res.Body)\n' +
    '  if err != nil {\n' +
    '    fmt.Println(err)\n' +
    '    return\n' +
    '  }\n' +
    '  fmt.Println(string(body))\n' +
    '}',
};
