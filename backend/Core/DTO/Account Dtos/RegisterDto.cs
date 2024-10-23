using Microsoft.AspNetCore.Mvc;
using System.ComponentModel.DataAnnotations;

namespace Core.DTO.AccountDtos
{
	public class RegisterDto
	{
		[Required(ErrorMessage = "Person Name can't be blank!")]
        [StringLength(50, ErrorMessage = "Person Name cannot exceed 50 characters.")]
        public string PersonName { get; set; } = string.Empty;

		[Required(ErrorMessage = "Email can't be blank")]
		[EmailAddress(ErrorMessage = "Email should be in a proper email address format")]
		[Remote(action: "IsEmailAlreadyRegistered", controller: "Account", ErrorMessage = "Email is already in use")]
        // [StringLength(100, ErrorMessage = "Email cannot exceed 100 characters.")]
        public string Email { get; set; } = string.Empty;

		[Required(ErrorMessage = "Gender can't be blank")]
        [StringLength(10, ErrorMessage = "Gender cannot exceed 10 characters.")]
        public string Gender { get; set; } = string.Empty;

		[Required(ErrorMessage = "Address can't be blank")]
        [StringLength(100, ErrorMessage = "Address cannot exceed 100 characters.")]
        public string Address { get; set; } = string.Empty;

		[Required(ErrorMessage = "Postal code can't be blank")]
		[RegularExpression("^[0-9]*$", ErrorMessage = "Postal code should be digits only")]
		public string PostalCode { get; set; } = string.Empty;

		[Required(ErrorMessage = "Phone number can't be blank")]
        [Phone(ErrorMessage = "Invalid phone number format.")]
        // [RegularExpression("^[0-9]*$", ErrorMessage = "Phone number should be digits only")]
        public string PhoneNumber { get; set; } = string.Empty;

		[Required(ErrorMessage = "Password can't be blank")]
        [StringLength(100, ErrorMessage = "Password must be between 6 and 100 characters.")]
        public string Password { get; set; } = string.Empty;

		[Required(ErrorMessage = "Confirm Password can't be blank")]
		[Compare("Password", ErrorMessage = "Password and Confirm password do not match")]
		public string ConfirmPassword { get; set; } = string.Empty;
	}
}
