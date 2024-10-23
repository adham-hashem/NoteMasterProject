using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using System.Security.Claims;
using Core.DTO;
using Core.Domain.Entities;
using Core.Services;
using Core.Services_contracts;
using Core.DTO.AccountDtos;
using Infrastructure.DB;

namespace NoteMasterAPI.Controllers
{
    [Route("api/account")]
    [ApiController]
    [AllowAnonymous]
    public class AccountController : ControllerBase
	{
		private readonly UserManager<ApplicationUser> _userManager;
		private readonly SignInManager<ApplicationUser> _signInManager;
		private readonly RoleManager<ApplicationRole> _roleManager;
		private readonly NotesDbContext _context;
		private readonly IJwtService _jwtService;
		private readonly IEmailSender _emailSender;

		public AccountController(UserManager<ApplicationUser> userManager, SignInManager<ApplicationUser> signInManager, RoleManager<ApplicationRole> roleManager, IJwtService jwtService, NotesDbContext context, IEmailSender emailSender)
		{
			_userManager = userManager;
			_signInManager = signInManager;
			_roleManager = roleManager;
			_context = context;
			_jwtService = jwtService;
			_emailSender = emailSender;
		}

        private Guid GetUserIdFromClaims()
        {
            return Guid.Parse(User.FindFirstValue(ClaimTypes.NameIdentifier));  // This gets the "sub" claim or any other claim containing the user ID
        }


        // POST: api/account/register
        [HttpPost("register")]
		public async Task<ActionResult<ApplicationUser>> PostRegister(RegisterDto registerDto)
		{
			// Validation
			if (ModelState.IsValid == false)
			{
				string errorMessage = string.Join(" | ",
					ModelState.Values.SelectMany(v => v.Errors)
					.Select(e => e.ErrorMessage));
				return Problem(errorMessage);
			}

			// Create User
			ApplicationUser user = new ApplicationUser
			{
				PersonName = registerDto.PersonName,
				UserName = registerDto.Email,
				Email = registerDto.Email,
				Gender = registerDto.Gender,
				Address = registerDto.Address,
				PostalCode = registerDto.PostalCode,
				PhoneNumber = registerDto.PhoneNumber
			};

			IdentityResult result = await _userManager.CreateAsync(user,
				registerDto.Password);

			/*			if (result.Succeeded)
						{
							// Sign-in
							await _signInManager.SignInAsync(user, isPersistent: false);
							var authenticationResponse = _jwtService.CreateJwtToken(user);
							return Ok(authenticationResponse);
						}
						else
						{
							string errorMessage = string.Join(" | ",
								result.Errors.Select(e => e.Description));
							return Problem(errorMessage);
						}*/
			return Ok();
		}


		// GET
		[HttpGet]
		public async Task<IActionResult> IsEmailAlreadyRegistered(string email)
		{
			var user = await _userManager.FindByEmailAsync(email);

			if (user == null)
			{
				return Ok(true); //
			}
			else
			{
				return Ok(false); //
			}
		}


		// POST: api/account/login
		[HttpPost("login")]
		public async Task<ActionResult<ApplicationUser>> PostLogin(LoginDto loginDto)
		{
			if (ModelState.IsValid == false)
			{
				var ErrorMessage = string.Join("|",
					ModelState.Values.SelectMany(v => v.Errors)
					.Select(e => e.ErrorMessage));
				return Problem(ErrorMessage);
			}

			var result = await _signInManager.PasswordSignInAsync(loginDto.Email, loginDto.Password,
				isPersistent: false, lockoutOnFailure: false);

			if (result.Succeeded)
			{
				var user = await _userManager.FindByEmailAsync(loginDto.Email);

				if (user == null)
				{
					return NoContent();
				}

				await _signInManager.SignInAsync(user, isPersistent: false);
				var authenticationResponse = _jwtService.CreateJwtToken(user);

				return Ok(authenticationResponse);
			}
			else
			{
				return Problem("Invalid email or password.");
			}
		}


		// GET: api/account/logout
		[HttpGet("logout")]
		public async Task<IActionResult> GetLogout()
		{
			await _signInManager.SignOutAsync();
			return NoContent();
		}


		// GET: api/account/user
		[Authorize]
		[HttpGet("user")]
		public async Task<IActionResult> GetApplicationUser()
		{
			Guid userId = GetUserIdFromClaims();

			var user = await _context.Users
					.FirstOrDefaultAsync(u => u.Id == userId);

			if (user == null)
			{
				return NotFound();
			}

			var userDto = new UserDto
			{
				PersonName = user.PersonName ?? string.Empty,
				Gender = user.Gender ?? "Not specified",
				Address = user.Address  ?? "Unknown",
				PostalCode = user.PostalCode ?? "N/A",
				Email = user.Email ?? string.Empty,
				PhoneNumber = user.PhoneNumber ?? "N/A"
			};

			return Ok(userDto);

        }


		// PUT: api/account/user
		[Authorize]
		[HttpPut("user")]
		public async Task<IActionResult> PutUser(EditUserDto editUserDto)
		{
            Guid? userId = GetUserIdFromClaims();
            if (userId == null)
            {
                return Unauthorized("User ID not found in claims.");
            }

            var user = await _userManager.FindByIdAsync(userId.ToString());

			if (user == null)
			{
				return NotFound();
			}

			var passwordCheck = await _signInManager.CheckPasswordSignInAsync(user, editUserDto.Password, lockoutOnFailure: false);

			if (!passwordCheck.Succeeded)
			{
				return Unauthorized("Incorrect password.");
			}

			user.PersonName = editUserDto.PersonName ?? user.PersonName;
			user.Gender = editUserDto.Gender ?? user.Gender;
			user.Address = editUserDto.Address ?? user.Address;
			user.PostalCode = editUserDto.PostalCode ?? user.PostalCode;
			user.PhoneNumber = editUserDto.PhoneNumber ?? user.PhoneNumber;

			// Email
			if (!string.IsNullOrEmpty(editUserDto.Email) && editUserDto.Email != user.Email)
			{
				user.Email = editUserDto.Email;
				user.UserName = editUserDto.Email;
			}

			var result = await _userManager.UpdateAsync(user);
			if (result.Succeeded)
			{
				return NoContent();
			}
			string errorMessage = string.Join(" | ", result.Errors.Select(e => e.Description));
			return Problem(errorMessage);

		}


		[HttpPost]
		[Route("forgot-password")]
		[AllowAnonymous]
		// [Authorize("NoAuthenticated")]
		public async Task<IActionResult> ForgotPassword(ForgotPasswordDto forgotPasswordDto)
		{
			try
			{
				ApplicationUser? user = await _userManager.FindByEmailAsync(forgotPasswordDto.Email!);

				if (user == null)
				{
					return Problem("Email doesn't exist", statusCode: 400);
				}

				string resetToken = await _userManager.GeneratePasswordResetTokenAsync(user);

				string message = $"Your reset code: {resetToken}\n Go back to the app and enter this code and your new password";
				await _emailSender.SendEmailAsync(forgotPasswordDto.Email, "Your Note Master account password reset", message);

				return Ok("An email is sent to your account to reset your password!");
			}
			catch
			{
				return Problem("Failed to send the email to your account please try again later!", statusCode: 500);
			}
		}

		[HttpPost]
		[Route("reset-password")]
		[AllowAnonymous]
		// [Authorize("NoAuthenticated")]
		public async Task<IActionResult> ResetPassword(ResetPasswordDto resetPasswordDto)
		{
			ApplicationUser? user = await _userManager.FindByEmailAsync(resetPasswordDto.Email!);

			if (user == null)
			{
				return Problem("The email doesn't exist.");
			}

			IdentityResult result = await _userManager.ResetPasswordAsync(
				user,
				resetPasswordDto.ResetToken!,
				resetPasswordDto.NewPassword!
				);

			if (result.Succeeded)
			{
				return Ok(await _jwtService.CreateJwtToken(user));
			}
			else
			{
				string errors = string.Join(" ,\n", result.Errors.Select(e => e.Description));
				return Problem(errors, statusCode: 400);
			}

		}

	}
}
