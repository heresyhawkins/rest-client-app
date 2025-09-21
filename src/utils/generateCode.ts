import { RequestType } from '@types';
import { isValidJson } from './isValidJson';
import { prettifyJson } from './prettifyJson';

export function generateCode(language: string, request: RequestType) {
  switch (language) {
    case 'curl': {
      return generateCurl(request);
    }
    case 'fetch': {
      return generateFetch(request);
    }
    case 'xhr': {
      return generateXhr(request);
    }
    case 'nodejs': {
      return generateNodeJS(request);
    }
    case 'python': {
      return generatePython(request);
    }
    case 'java': {
      return generateJava(request);
    }
    case 'c#': {
      return generateCSharp(request);
    }
    case 'go': {
      return generateGo(request);
    }
    default: {
      throw new Error(`Unsupported language: ${language}`);
    }
  }
}

function generateCurl(request: RequestType) {
  let code = 'curl --location';

  const headers = request.headers
    ? ` \\${composeHeaders(`--header 'key: value'`, request.headers, ' \\')}`
    : '';
  const body = request.body
    ? ` \\\n--data '${
        isValidJson(request.body)
          ? JSON.stringify(JSON.parse(request.body), null, 4)
          : request.body
      }'`
    : '';

  switch (request.method) {
    case 'GET': {
      if (body.length > 0) {
        code += ` --request ${request.method}`;
      }
      break;
    }
    case 'POST': {
      if (body.length == 0) {
        code += ` --request ${request.method}`;
      }
      break;
    }
    default: {
      code += ` --request ${request.method}`;
    }
  }
  code += ` '${request.url ?? ''}'`;
  code += headers;
  code += body;
  return code;
}

function generateFetch(request: RequestType) {
  let headers = '';
  if (request.headers) {
    headers += 'const myHeaders = new Headers();';
    headers += composeHeaders(
      "myHeaders.append('key', 'value');",
      request.headers
    );
    headers += '\n';
  }

  const body = request.body
    ? `const raw = ${composeBody(request.body)};\n\n`
    : '';

  let requestOptions = 'const requestOptions = {\n';
  requestOptions += `  method: "${request.method}",\n`;
  if (headers.length > 0) {
    requestOptions += `  headers: myHeaders,\n`;
  }
  if (body.length > 0) {
    requestOptions += `  body: raw,\n`;
  }
  requestOptions += `  redirect: "follow"\n`;
  requestOptions += '};\n\n';

  let code =
    headers +
    `${body.length > 0 || headers.length > 0 ? '\n' : ''}` +
    body +
    requestOptions;
  code += `fetch("${request.url ?? ''}", requestOptions)\n`;
  code += '  .then((response) => response.text())\n';
  code += '  .then((result) => console.log(result))\n';
  code += '  .catch((error) => console.error(error));';
  return code;
}

function generateXhr(request: RequestType) {
  let code = '';
  const body = request.body ? `var data = ${composeBody(request.body)}` : '';
  if (body.length > 0) {
    code += body;
    code += ';\n\n';
  }
  code += 'var xhr = new XMLHttpRequest();\n';
  code += 'xhr.withCredentials = true;\n\n';
  code += 'xhr.addEventListener("readystatechange", function() {\n';
  code += '  if(this.readyState === 4) {\n';
  code += '    console.log(this.responseText);\n';
  code += '  }\n';
  code += '});\n\n';
  code += `xhr.open("${request.method}", "${request.url ?? ''}");`;
  const headers = composeHeaders(
    'xhr.setRequestHeader("key", "value");',
    request.headers
  );
  code += headers;
  code += '\n\n';
  code += `xhr.send(${body.length > 0 ? 'data' : ''});`;
  return code;
}

function generateNodeJS(request: RequestType) {
  let code = "var request = require('request');\n";
  code += 'var options = {\n';
  code += `  'method': '${request.method}',\n`;
  code += `  'url': '${request.url ?? ''}',\n`;
  code += `  'headers': {`;
  code += composeHeaders(`    'key': 'value'`, request.headers, ',');
  code += '\n  }\n';
  if (request.body) {
    code += `  body: ${composeBody(request.body)}\n`;
  }
  code += '};\n';
  code += 'request(options, function (error, response) {\n';
  code += '  if (error) throw new Error(error);\n';
  code += '  console.log(response.body);\n';
  code += '});';
  return code;
}

function generatePython(request: RequestType) {
  let code = 'import requests\n';
  if (
    request.body ||
    (request.headers &&
      Object.entries(request.headers).find(
        ([key, value]) => key === 'Content-Type' && value === 'application/json'
      ) !== undefined)
  ) {
    code += 'import json\n';
  }
  code += `\nurl = "${request.url ?? ''}"\n\n`;
  code += 'payload = ';
  if (request.body) {
    code += `${composeBody(request.body, 'json.dumps')}`;
  } else {
    code += '{}';
  }
  code += '\nheaders = ';
  if (request.headers) {
    code += '{';
    code += composeHeaders(`  'key': 'value'`, request.headers, ',');
    code += '\n}\n';
  } else {
    code += '{}\n';
  }
  code += `\nresponse = requests.request("${request.method}", url, headers=headers, data=payload)\n\n`;
  code += 'print(response.text)';
  return code;
}

function generateJava(request: RequestType) {
  let code = 'Unirest.setTimeouts(0, 0);\n';
  code += `HttpResponse<String> response = Unirest.${request.method.toLowerCase()}("${request.url ?? ''}")`;
  code += composeHeaders('  .header("key", "value")', request.headers);
  code += '\n';
  if (request.body) {
    code += `  .body("${composeBody(request.body, '')
      .replaceAll(/\n/g, '\\r\\n')
      .replaceAll(/^"|"$/g, '')
      .replaceAll('"', '\\"')}")\n`;
  }
  code += '  .asString();';
  return code;
}

function generateCSharp(request: RequestType) {
  const isJson =
    request.headers &&
    Object.entries(request.headers).find(
      ([key, value]) => key === 'Content-Type' && value === 'application/json'
    ) !== undefined;

  let code = 'var options = new RestClientOptions("")\n';
  code += '{\n';
  code += '  MaxTimeout = -1,\n';
  code += '};\n';
  code += 'var client = new RestClient(options);\n';
  code += `var request = new RestRequest("${request.url ?? ''}"`;
  code += `, Method.${request.method[0]}${request.method.slice(1).toLowerCase()});`;
  code += `${composeHeaders('request.AddHeader("key", "value");', request.headers)}\n`;
  if (request.body) {
    const body = composeBody(request.body, '')
      .replaceAll(/^"|"$/g, '')
      .replaceAll(/"|\\"/g, '""')
      .replaceAll(/\n|\\n/g, '\n" + "\\n" +\n@"');
    code += `var body = @"${body}";\n`;
  }
  if (request.body) {
    if (isJson) {
      code += 'request.AddStringBody(body, DataFormat.Json);\n';
    } else {
      code +=
        'request.AddParameter("text/plain", body, ParameterType.RequestBody);\n';
    }
  }
  code += 'RestResponse response = await client.ExecuteAsync(request);\n';
  code += 'Console.WriteLine(response.Content);';
  return code;
}

function generateGo(request: RequestType) {
  let code = 'package main\n\n';
  code += 'import (\n';
  code += '  "fmt"\n';
  if (request.body) {
    code += '  "strings"\n';
  }
  code += '  "net/http"\n';
  code += '  "io"\n';
  code += ')\n\n';
  code += 'func main() {\n\n';
  code += `  url := "${request.url ?? ''}"\n`;
  code += `  method := "${request.method}"\n\n`;
  if (request.body) {
    const body = composeBody(request.body, '')
      .replaceAll(/^"|"$/g, '')
      .replaceAll(/\n|\\n/g, '`+"\n"+`\n');
    code += `  payload := strings.NewReader(\`${body}\`)\n\n`;
  }
  code += '  client := &http.Client {\n';
  code += '  }\n';
  code += `  req, err := http.NewRequest(method, url, ${request.body ? 'payload' : 'nil'})\n\n`;
  code += getErrorHandlerGo();
  code += request.headers
    ? `${composeHeaders('  req.Header.Add("key", "value")', request.headers)}\n`
    : '';
  code += '\n  res, err := client.Do(req)\n';
  code += getErrorHandlerGo();
  code += '\n  defer res.Body.Close()\n\n';
  code += '  body, err := io.ReadAll(res.Body)\n';
  code += getErrorHandlerGo();
  code += '\n  fmt.Println(string(body))\n';
  code += '}';

  return code;
}

function composeBody(body: string, command = 'JSON.stringify') {
  const prettifiedBody = prettifyJson(body);
  if (isValidJson(body)) {
    return `${command.length > 0 ? `${command}(` : ''}${prettifiedBody}${command.length > 0 ? ')' : ''}`;
  }
  return `${prettifiedBody}`;
}

function composeHeaders(
  template: string,
  headers?: Record<string, string>,
  join = ''
) {
  return headers
    ? Object.entries(headers)
        .map(
          ([key, value]) =>
            `\n${template.replace('key', key).replace('value', value)}`
        )
        .join(join)
    : '';
}

function getErrorHandlerGo() {
  let code = '';
  code += '  if err != nil {\n';
  code += '    fmt.Println(err)\n';
  code += '    return\n';
  code += '  }';
  return code;
}
