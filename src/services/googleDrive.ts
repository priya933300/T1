export interface DriveFile {
  id: string;
  name: string;
  mimeType: string;
  createdTime?: string;
  modifiedTime?: string;
  size?: string;
  webViewLink?: string;
}

const FOLDER_NAME = 'Royal Companion Backups';

export const getOrCreateAppFolder = async (accessToken: string): Promise<string> => {
  // Search for existing folder
  const query = encodeURIComponent(`mimeType='application/vnd.google-apps.folder' and name='${FOLDER_NAME}' and trashed=false`);
  const searchRes = await fetch(
    `https://www.googleapis.com/drive/v3/files?q=${query}&fields=files(id,name)`,
    {
      headers: { Authorization: `Bearer ${accessToken}` },
    }
  );

  if (!searchRes.ok) {
    const errorText = await searchRes.text();
    throw new Error(`Google Drive API Error: ${errorText}`);
  }

  const searchData = await searchRes.json();
  if (searchData.files && searchData.files.length > 0) {
    return searchData.files[0].id;
  }

  // Create new folder
  const createRes = await fetch('https://www.googleapis.com/drive/v3/files', {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${accessToken}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      name: FOLDER_NAME,
      mimeType: 'application/vnd.google-apps.folder',
    }),
  });

  if (!createRes.ok) {
    const errorText = await createRes.text();
    throw new Error(`Google Drive Folder Creation Error: ${errorText}`);
  }

  const newFolder = await createRes.json();
  return newFolder.id;
};

export const listAppDriveFiles = async (accessToken: string, folderId?: string): Promise<DriveFile[]> => {
  let q = 'trashed=false';
  if (folderId) {
    q += ` and '${folderId}' in parents`;
  }

  const res = await fetch(
    `https://www.googleapis.com/drive/v3/files?q=${encodeURIComponent(q)}&fields=files(id,name,mimeType,createdTime,modifiedTime,size,webViewLink)&orderBy=modifiedTime desc&pageSize=30`,
    {
      headers: { Authorization: `Bearer ${accessToken}` },
    }
  );

  if (!res.ok) {
    const errorText = await res.text();
    throw new Error(`Google Drive List Error: ${errorText}`);
  }

  const data = await res.json();
  return data.files || [];
};

export const uploadFileToDrive = async (
  accessToken: string,
  fileName: string,
  mimeType: string,
  content: string,
  folderId?: string
): Promise<DriveFile> => {
  const metadata: any = {
    name: fileName,
    mimeType: mimeType,
  };

  if (folderId) {
    metadata.parents = [folderId];
  }

  const boundary = '-------314159265358979323846';
  const delimiter = `\r\n--${boundary}\r\n`;
  const closeDelimiter = `\r\n--${boundary}--`;

  const multipartRequestBody =
    delimiter +
    'Content-Type: application/json; charset=UTF-8\r\n\r\n' +
    JSON.stringify(metadata) +
    delimiter +
    `Content-Type: ${mimeType}\r\n\r\n` +
    content +
    closeDelimiter;

  const res = await fetch(
    'https://www.googleapis.com/upload/drive/v3/files?uploadType=multipart&fields=id,name,mimeType,createdTime,modifiedTime,size,webViewLink',
    {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${accessToken}`,
        'Content-Type': `multipart/related; boundary=${boundary}`,
      },
      body: multipartRequestBody,
    }
  );

  if (!res.ok) {
    const errorText = await res.text();
    throw new Error(`Google Drive Upload Error: ${errorText}`);
  }

  return await res.json();
};

export const deleteDriveFile = async (accessToken: string, fileId: string): Promise<void> => {
  const res = await fetch(`https://www.googleapis.com/drive/v3/files/${fileId}`, {
    method: 'DELETE',
    headers: { Authorization: `Bearer ${accessToken}` },
  });

  if (!res.ok && res.status !== 204) {
    const errorText = await res.text();
    throw new Error(`Google Drive Delete Error: ${errorText}`);
  }
};
