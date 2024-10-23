using Microsoft.AspNetCore.Identity;
using Microsoft.IdentityModel.Tokens;
using System.IdentityModel.Tokens.Jwt;
using System.Security.Claims;
using System.Text;
using Core.DTO;
using Core.Domain.Entities;
using Core.Services;
using Core.Services_contracts;
using Core.DTO.AccountDtos;
using Microsoft.Extensions.Configuration;

namespace Core.Services
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

            // Creating an array of objects representing the user's claims such as their Id, name, email, etc.
            Claim[] claims = new Claim[]
            {
            // subject (user id)
            new Claim(JwtRegisteredClaimNames.Sub, user.Id.ToString()),

            // JWT unique ID
            new Claim(JwtRegisteredClaimNames.Jti, Guid.NewGuid().ToString()),

            // Issued at (date and time of token generation)
            // new Claim(JwtRegisteredClaimNames.Iat, DateTime.UtcNow.ToString()),
            new Claim(JwtRegisteredClaimNames.Iat, EpochTime.GetIntDate(DateTime.UtcNow).ToString()),

            // Unique name identifier of the user (Email)
            // new Claim(ClaimTypes.NameIdentifier, user.Email!),
            new Claim(ClaimTypes.NameIdentifier, user.Id.ToString()),

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
                Expiration = expiration,
                UserId = user.Id.ToString(),
                PersonName = user.PersonName,
                Email = user.Email
            };

        }
    }
}


// ==============================================

/*using Microsoft.AspNetCore.Identity;
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

        private readonly UserManager<ApplicationUser> _userManager;
        public JwtService(UserManager<ApplicationUser> userManager, IConfiguration configuration)
        {
            _userManager = userManager;
            _configuration = configuration;
        }

        public async Task<AuthenticationResponse> CreateJwtToken(ApplicationUser user)
        {
            // Expiration date.
            DateTime expires = DateTime.UtcNow.AddMinutes(
                Convert.ToDouble(_configuration["Jwt:EXPIRATION_MINUTES"]));

            // Secret key. 
            var key = new SymmetricSecurityKey(Encoding.UTF8.GetBytes(_configuration["Jwt:Key"]!));

            // Signin credentials.
            var credentials = new SigningCredentials(key, SecurityAlgorithms.HmacSha256Signature);

            // Claims.
            List<Claim> claims = [
                new Claim(JwtRegisteredClaimNames.Sub, user.Id.ToString()),
                new Claim(JwtRegisteredClaimNames.Iat, DateTime.UtcNow.ToString()),
                new Claim(JwtRegisteredClaimNames.Jti, Guid.NewGuid().ToString()),
                new Claim(ClaimTypes.Name, user.PersonName!),
                new Claim(ClaimTypes.NameIdentifier, user.PersonName!),
                new Claim(ClaimTypes.Email, user.Email!)
            ];

            // Token handler
            JwtSecurityTokenHandler handler = new();

            // Token descriptor
            SecurityTokenDescriptor descriptor = new()
            {
                Subject = new ClaimsIdentity(claims),
                Issuer = _configuration["Jwt:Issuer"],
                Expires = expires,
                SigningCredentials = credentials,
            };

            // Token creating.
            var token = handler.CreateToken(descriptor);

            // Token writing
            string jwt = handler.WriteToken(token);

            return new AuthenticationResponse()
            {
                Token = jwt,
                Email = user.Email,
                PersonName = user.PersonName,
                Expiration = expires
            };
        }
    }
}*/

// ========================================

/*using Core.Domain.Entities;
using Core.Domain.Repository_contracts;
using Core.DTO.AccountDtos;
using Core.Services_contracts;
using Microsoft.AspNetCore.Identity;
using Microsoft.IdentityModel.Tokens;
using System.IdentityModel.Tokens.Jwt;
using System.Security.Claims;
using System.Text;

namespace Core.Services
{

    public class JwtServices : IJwtServices
    {
        private readonly UserManager<ApplicationUser> _userManager;
        private readonly ITokenRepository _tokenRepository;
        public JwtServices(
                UserManager<ApplicationUser> userManager,
                ITokenRepository tokenRepository
            )
        {
            _userManager = userManager;
            _tokenRepository = tokenRepository;
        }

        public async Task AddExpiredToken(string token)
        {
            await _tokenRepository.AddExpiredToken(token);
        }

        public async Task<AuthenticationResponseDto> GetJwtToken(ApplicationUser user)
        {
            // Expiration date.
            DateTime expires = DateTime.UtcNow.AddMonths(1);

            // Secret key. 
            var key = new SymmetricSecurityKey(Encoding.UTF8.GetBytes(Environment.GetEnvironmentVariable("BEQALTK_DEV_JWT_SECRET")!));

            // Signin credentials.
            var credentials = new SigningCredentials(key, SecurityAlgorithms.HmacSha256Signature);

            // Claims.
            IList<string> userRoles = await _userManager.GetRolesAsync(user);

            List<Claim> claims = [
                new Claim(JwtRegisteredClaimNames.Sub , user.Id.ToString()),
                new Claim(JwtRegisteredClaimNames.Iat , DateTime.UtcNow.ToString()),
                new Claim(JwtRegisteredClaimNames.Jti , Guid.NewGuid().ToString()),
                new Claim(ClaimTypes.Name , user.UserName!),
                new Claim(ClaimTypes.NameIdentifier , user.UserName!),
                new Claim(ClaimTypes.Email , user.Email!)
            ];

            claims.AddRange(userRoles.Select(role => new Claim(ClaimTypes.Role, role)));

            // Token handler
            JwtSecurityTokenHandler handler = new();

            // Token descriptor
            SecurityTokenDescriptor descriptor = new()
            {
                Subject = new ClaimsIdentity(claims),
                Issuer = Environment.GetEnvironmentVariable("BEQALTK_DEV_JWT_ISSUER"),
                Expires = expires,
                SigningCredentials = credentials,
            };

            // Token creating.
            var token = handler.CreateToken(descriptor);

            // Token writing
            string jwt = handler.WriteToken(token);

            return new AuthenticationResponseDto()
            {
                Token = jwt,
                TokenExpiresAt = expires.ToString(),
                UserID = user.Id.ToString(),
                Name = user.UserName,
                Email = user.Email
            };
        }

        public bool IsExpiredToken(string token)
        {
            return _tokenRepository.IsExpiredToken(token);
        }
    }
}
*/