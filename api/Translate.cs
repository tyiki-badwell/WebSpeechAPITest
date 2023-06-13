using System;
using System.IO;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Mvc;
using Microsoft.Azure.WebJobs;
using Microsoft.Azure.WebJobs.Extensions.Http;
using Microsoft.AspNetCore.Http;
using Microsoft.Extensions.Logging;
using System.Net.Http;
using System.Collections.Generic;
using Microsoft.Extensions.Configuration;
using System.Text.Json;

namespace WebSpeechAPITest;

public class Translate
{
    private readonly HttpClient _httpClient;
    private readonly ILogger<Translate> _logger;
    private readonly IConfiguration _configuration;

    public Translate(
        IHttpClientFactory httpClientFactory,
        ILogger<Translate> logger,
        IConfiguration configuration
    )
    {
        _httpClient = httpClientFactory.CreateClient();
        _logger = logger;
        _configuration = configuration;
    }

    [FunctionName("translate")]
    public async Task<IActionResult> Run(
        [HttpTrigger(AuthorizationLevel.Function, "post", Route = null)] HttpRequest req
    )
    {
        var param = JsonSerializer.Deserialize<Dictionary<string, string>>(req.Body);
        _logger.LogInformation($"{param}");

        var api = "https://api-free.deepl.com/v2/translate";

        var content = new FormUrlEncodedContent(param);

        var request = new HttpRequestMessage(HttpMethod.Post, api);
        request.Content = content;
        request.Headers.Add("Authorization", $"DeepL-Auth-Key ${_configuration["DEEPL_API_KEY"]}");

        var response = await _httpClient.SendAsync(request);

        var responseMessage = await response.Content.ReadAsStringAsync();

        return new OkObjectResult(responseMessage);
    }
}
