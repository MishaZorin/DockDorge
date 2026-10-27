import {
  BadRequestException,
  Injectable,
  InternalServerErrorException,
} from '@nestjs/common';
import {
  createCipheriv,
  createDecipheriv,
  randomBytes,
} from 'node:crypto';

const ALGORITHM = 'aes-256-gcm';
const IV_LENGTH = 12;
const TAG_LENGTH = 16;
const KEY_LENGTH = 32;
const FORMAT_VERSION = 'v1';

@Injectable()
export class CryptoService {
  private readonly key: Buffer;

  constructor() {
    const encodedKey = process.env.DATA_ENCRYPTION_KEY;

    if (!encodedKey) {
      throw new Error(
        'DATA_ENCRYPTION_KEY is not configured',
      );
    }

    const key = Buffer.from(encodedKey, 'base64');

    if (
      key.length !== KEY_LENGTH ||
      key.toString('base64') !== encodedKey
    ) {
      throw new Error(
        'DATA_ENCRYPTION_KEY must be a valid ' +
        'base64-encoded 32-byte key',
      );
    }

    this.key = key;
  }

  encrypt(plaintext: string): string {
    const iv = randomBytes(IV_LENGTH);

    const cipher = createCipheriv(
      ALGORITHM,
      this.key,
      iv,
      { authTagLength: TAG_LENGTH },
    );

    const ciphertext = Buffer.concat([
      cipher.update(plaintext, 'utf8'),
      cipher.final(),
    ]);

    const tag = cipher.getAuthTag();

    return [
      FORMAT_VERSION,
      iv.toString('base64'),
      tag.toString('base64'),
      ciphertext.toString('base64'),
    ].join('.');
  }

  decrypt(payload: string): string {
    const parts = payload.split('.');

    if (parts.length !== 4) {
      throw new BadRequestException(
        'Invalid encrypted payload',
      );
    }

    const [version, ivEncoded, tagEncoded, dataEncoded] =
      parts;

    if (
      version !== FORMAT_VERSION ||
      !this.isCanonicalBase64(ivEncoded) ||
      !this.isCanonicalBase64(tagEncoded) ||
      !this.isCanonicalBase64(dataEncoded)
    ) {
      throw new BadRequestException(
        'Invalid encrypted payload',
      );
    }

    const iv = Buffer.from(ivEncoded, 'base64');
    const tag = Buffer.from(tagEncoded, 'base64');
    const ciphertext = Buffer.from(dataEncoded, 'base64');

    if (
      iv.length !== IV_LENGTH ||
      tag.length !== TAG_LENGTH
    ) {
      throw new BadRequestException(
        'Invalid encrypted payload',
      );
    }

    try {
      const decipher = createDecipheriv(
        ALGORITHM,
        this.key,
        iv,
        { authTagLength: TAG_LENGTH },
      );

      decipher.setAuthTag(tag);

      return Buffer.concat([
        decipher.update(ciphertext),
        decipher.final(),
      ]).toString('utf8');
    } catch {
      throw new BadRequestException(
        'Unable to decrypt payload',
      );
    }
  }

  private isCanonicalBase64(value: string): boolean {
    if (
      value.length === 0 ||
      !/^(?:[A-Za-z0-9+/]{4})*(?:[A-Za-z0-9+/]{2}==|[A-Za-z0-9+/]{3}=)?$/.test(
        value,
      )
    ) {
      return false;
    }

    return Buffer.from(value, 'base64').toString('base64') === value;
  }
}