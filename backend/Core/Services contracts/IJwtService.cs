using Microsoft.IdentityModel.Tokens;
using System.IdentityModel.Tokens.Jwt;
using System.Security.Claims;
using System.Text;
using Core.DTO;
using Core.Domain.Entities;
using Core.Services_contracts;
using Core.DTO.AccountDtos;

namespace Core.Services_contracts
{
    public interface IJwtService
    {
        Task<AuthenticationResponse> CreateJwtToken(ApplicationUser user);
    }
}







/*
using Microsoft.IdentityModel.Tokens;
using System.IdentityModel.Tokens.Jwt;
using System.Security.Claims;
using System.Text;
using WebApplication2.DTO;
using WebApplication2.Identity;
using WebApplication2.Services_contracts;

namespace WebApplication2.Services
{
    public class JwtService : IJwtService
    {
        public readonly IConfiguration _configuration;
        public JwtService(IConfiguration configuration)
        {
            _configuration = configuration;
        }

        public async Task<AuthenticationResponse> CreateJwtToken(ApplicationUser user)
        {
            // Create the token expiration time by adding the configured expiration minutes to the current time.
            DateTime expiration = DateTime.UtcNow.AddMinutes(
                Convert.ToDouble(_configuration["Jwt:EXPIRATION_MINUTES"]));

            // Define the user's claims, including the user ID, email, name, and JWT-specific claims.
            var claims = new List<Claim>
            {
                new Claim(JwtRegisteredClaimNames.Sub, user.Id.ToString()),       // Subject (User ID)
                new Claim(JwtRegisteredClaimNames.Jti, Guid.NewGuid().ToString()),// JWT unique ID
                new Claim(JwtRegisteredClaimNames.Iat, EpochTime.GetIntDate(DateTime.UtcNow).ToString(), ClaimValueTypes.Integer64), // Issued at (Unix timestamp)
                new Claim(ClaimTypes.NameIdentifier, user.Email!),               // User email
                new Claim(ClaimTypes.Name, user.PersonName!)                     // User name
            };

            // Generate the security key using the secret from the configuration.
            SymmetricSecurityKey securityKey = new SymmetricSecurityKey(
                Encoding.UTF8.GetBytes(_configuration["Jwt:Key"]!));

            // Sign the token using the HMACSHA256 algorithm.
            SigningCredentials signingCredentials = new SigningCredentials(
                securityKey, SecurityAlgorithms.HmacSha256);

            // Create the JWT token using the claims, expiration time, and signing credentials.
            JwtSecurityToken tokenGenerator = new JwtSecurityToken(
                _configuration["Jwt:Issuer"],       // Issuer
                null,                               // Audience (null if not required)
                claims,                             // Claims
                expires: expiration,                // Expiration time
                signingCredentials: signingCredentials // Signing credentials
            );

            // Write the token as a string.
            JwtSecurityTokenHandler tokenHandler = new JwtSecurityTokenHandler();
            string token = tokenHandler.WriteToken(tokenGenerator);

            // Return the token details in an AuthenticationResponse object.
            return new AuthenticationResponse()
            {
                Token = token,
                Email = user.Email,
                PersonName = user.PersonName,
                Expiration = expiration
            };
        }
    }
}

This is the second

using Microsoft.IdentityModel.Tokens;
using System.IdentityModel.Tokens.Jwt;
using System.Security.Claims;
using System.Text;
using WebApplication2.DTO;
using WebApplication2.Identity;
using WebApplication2.Services_contracts;

namespace WebApplication2.Services
{
    public class JwtService : IJwtService
    {
        public readonly IConfiguration _configuration;
        public JwtService(IConfiguration configuration)
        {
            _configuration = configuration;
        }
        // Generating Jwt token using the information of the user and the configuration settings
        // Returns AuthenticationResponse object
        public async Task<AuthenticationResponse> CreateJwtToken(ApplicationUser user)
        {
            // Create a DateTime object representing the token expiration time
            // by adding the number of minutes specified in the configuration
            // to the Utc time
            DateTime expiration = DateTime.UtcNow.AddMinutes(
                Convert.ToDouble(_configuration["Jwt:EXPIRATION_MINUTES"]));

            // Creating an array of objects representing the user's claims
            // such as their Id, name, email, etc.
            Claim[] claims = new Claim[]
            {
            // subject (user id)
            new Claim(JwtRegisteredClaimNames.Sub, user.Id.ToString()),

            // JWT unique ID
            new Claim(JwtRegisteredClaimNames.Jti, Guid.NewGuid().ToString()),

            // Issued at (date and time of token generation)
            // new Claim(JwtRegisteredClaimNames.Iat, DateTime.UtcNow.ToString()),
            new Claim(JwtRegisteredClaimNames.Iat, EpochTime.GetIntDate(DateTime.UtcNow).ToString(),

            // Unique name identifier of the user (Email)
            new Claim(ClaimTypes.NameIdentifier, user.Email!),

            // Name of the user
            new Claim(ClaimTypes.Name, user.PersonName!)
            };

            // Creating a SymmetricSecurityKey object using the key specified in the configuration
            SymmetricSecurityKey securityKey = new SymmetricSecurityKey(
                Encoding.UTF8.GetBytes(_configuration["Jwt:Key"]!));

            // Creating a SigningCredintials object using the security key and HMACSHA algorithm
            SigningCredentials signingCredentials = new SigningCredentials(
                securityKey, SecurityAlgorithms.HmacSha256);

            // Creating a JwtSecurityToken object with the given ...
            JwtSecurityToken tokenGenerator = new JwtSecurityToken(
                _configuration["Jwt:Issuer"],
                null,
                claims,
                expires: expiration,
                signingCredentials: signingCredentials
                );

            // Using the JwtSecurityTokenHandler to write the token as a string
            JwtSecurityTokenHandler tokenHandler = new JwtSecurityTokenHandler();
            string token = tokenHandler.WriteToken(tokenGenerator);

            // Creating and returning an AuthenticationResponse object with the
            // Jwt token, user email, user name, expiration date
            return new AuthenticationResponse()
            {
                Token = token,
                Email = user.Email,
                PersonName = user.PersonName,
                Expiration = expiration
            };

        }
    }
}


write them organized and what is the difference
*/