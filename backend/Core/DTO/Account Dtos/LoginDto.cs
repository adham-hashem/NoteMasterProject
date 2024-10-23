using System.ComponentModel.DataAnnotations;

namespace Core.DTO.AccountDtos
{
    public class LoginDto
    {
        [Required(ErrorMessage = "Email can't be blank")]
        [EmailAddress(ErrorMessage = "Email must be in a proper email address format")]
        // [StringLength(100, ErrorMessage = "Email cannot exceed 100 characters.")]
        public string Email { get; set; }

        [Required(ErrorMessage = "Password can't be blank")]
        // [StringLength(100, ErrorMessage = "Password must be between 6 and 100 characters.")]
        public string Password { get; set; }
    }
}
