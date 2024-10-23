namespace Core.DTO.AccountDtos
{
    public class AuthenticationResponse
    {
        public string? Token { get; set; } = string.Empty;
        public DateTime Expiration { get; set; }
        public string? UserId { get; set; }
        public string? PersonName { get; set; } = string.Empty;
        public string? Email { get; set; } = string.Empty;
    }
}
