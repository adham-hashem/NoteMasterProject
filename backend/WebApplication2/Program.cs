using Microsoft.AspNetCore.Authentication.JwtBearer;
using Microsoft.EntityFrameworkCore;
using Microsoft.IdentityModel.Tokens;
using System.Text;
using Core.Domain.Entities;
using Core.Services;
using Core.Services_contracts;
using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.Identity.EntityFrameworkCore;
using Microsoft.AspNetCore.Authentication.Cookies;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc.Authorization;
using Microsoft.AspNetCore.Mvc;
using NoteMasterAPI.Extensions;

public class Program
{
    public static void Main(string[] args)
    {
        var builder = WebApplication.CreateBuilder(args);

        builder.RegisterAndConfigureServices();

        var app = builder.Build();

        app.UseHsts();
        app.UseHttpsRedirection(); // ensures all HTTP requests are redirected to HTTPS.
        app.UseStaticFiles();

        app.UseRouting(); // sets up the routing for the application.
        app.UseCors("CorsPolicy"); // enables CORS (Cross-Origin Resource Sharing) policies.

        app.UseAuthentication(); // ensures that authentication happens before authorization checks.
        app.UseAuthorization(); // applies the authorization policies.

        app.MapControllers(); // maps the controllers to the routes defined in the application.

        app.Run(); // starts the application.

    }
}
