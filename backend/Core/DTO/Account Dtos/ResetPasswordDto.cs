using System.ComponentModel.DataAnnotations;

namespace Core.DTO.AccountDtos
{
    public class ResetPasswordDto
    {
        [Required(ErrorMessage = "Email can't be blank")]
        [EmailAddress(ErrorMessage = "Email must be in a proper email address format")]
        public string? Email { get; set; }

        [Required]
        public string? ResetToken { get; set; }

        [Required]
        public string? NewPassword { get; set; }

        [Required]
        [Compare("NewPassword")]
        public string? ConfirmNewPassword { get; set; }
    }
}
