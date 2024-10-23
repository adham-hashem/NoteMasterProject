using System.Net;
using System.Net.Mail;
using Core.Services_contracts;
using Microsoft.Extensions.Configuration;

namespace Infrastructure.Services
{
    // This is a service but we put it in the external apis folder
    public class EmailSender : IEmailSender
    {
        private readonly IConfiguration _configuration;
        public EmailSender(IConfiguration configuration) 
        {
            _configuration = configuration;
        }

        public async Task SendEmailAsync(string toEmail, string subject, string message)
        {
            IConfigurationSection smtpSettings = _configuration.GetSection("smtpSettings");
            SmtpClient smtpClient = new()
            {
                Host = smtpSettings["Host"]!,
                Port = int.Parse(smtpSettings["port"]!),
                EnableSsl = Convert.ToBoolean(smtpSettings["EnableSsl"]!),
                Credentials = new NetworkCredential()
                {
                    UserName = Environment.GetEnvironmentVariable("NoteMaster_DEV_EMAIL"),
                    Password = Environment.GetEnvironmentVariable("NoteMaster_DEV_PASSWORD")
                }
            };

            MailMessage mailMessage = new()
            {
                From = new MailAddress(Environment.GetEnvironmentVariable("NoteMaster_DEV_EMAIL")!, "Note Master"),
                Subject = subject,
                Body = message
            };

            mailMessage.To.Add(toEmail);

            try
            {
                await smtpClient.SendMailAsync(mailMessage);
            }
            catch
            {
                throw new Exception("Email failed to send");
            }
        }
    }
}
