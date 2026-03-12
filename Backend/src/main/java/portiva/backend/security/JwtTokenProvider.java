package portiva.backend.security;

import io.jsonwebtoken.Jwts;
import io.jsonwebtoken.SignatureAlgorithm;
import io.jsonwebtoken.security.Keys;
import java.security.Key;
import java.util.Date;
import org.springframework.stereotype.Component;

@Component
public class JwtTokenProvider {

  private final Key key = Keys.secretKeyFor(SignatureAlgorithm.HS256);
  private final long validityInMillis = 1000L * 60 * 60 * 24; // 24 hours

  public String generateToken(String subject) {
    Date now = new Date();
    Date expiry = new Date(now.getTime() + validityInMillis);

    return Jwts.builder()
        .setSubject(subject)
        .setIssuedAt(now)
        .setExpiration(expiry)
        .signWith(key)
        .compact();
  }
}

